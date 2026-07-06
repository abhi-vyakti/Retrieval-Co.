const fs = require('fs');
const path = require('path');

// On Vercel, the only writable directory is /tmp
const DB_FILE = process.env.VERCEL ? '/tmp/db.json' : path.join(__dirname, 'db.json');

let inMemoryDB = null;

// Helper to load db
function loadDB() {
    if (inMemoryDB) {
        return inMemoryDB;
    }
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            inMemoryDB = JSON.parse(data);
            return inMemoryDB;
        }
    } catch (e) {
        console.error('Error loading db.json, resetting database:', e);
    }
    inMemoryDB = { users: [], posts: [] };
    return inMemoryDB;
}

// Helper to save db
function saveDB(db) {
    inMemoryDB = db;
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    } catch (e) {
        console.warn('[MOCK DB] Could not write db.json to disk (expected on read-only systems like Vercel):', e.message);
    }
}

// Generate unique ObjectId string
function generateId() {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

// ObjectId class
class ObjectId {
    constructor(id) {
        this.id = id ? id.toString() : generateId();
    }
    toString() {
        return this.id;
    }
    equals(other) {
        return this.toString() === (other ? other.toString() : '');
    }
    toJSON() {
        return this.toString();
    }
}

class Schema {
    constructor(definition, options) {
        this.definition = definition;
        this.options = options;
    }
}
Schema.Types = { ObjectId };

// Helper to construct a Document instance
function createDocument(collectionName, data) {
    const doc = {
        _id: data._id ? new ObjectId(data._id) : new ObjectId(),
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        ...data
    };

    // Ensure _id is an ObjectId instance
    if (!(doc._id instanceof ObjectId)) {
        doc._id = new ObjectId(doc._id);
    }

    // Methods
    doc.save = async function() {
        const db = loadDB();
        const collection = db[collectionName] || [];
        const index = collection.findIndex(item => item._id === doc._id.toString());
        
        doc.updatedAt = new Date();
        const plainObject = doc.toObject();

        if (index >= 0) {
            collection[index] = plainObject;
        } else {
            collection.push(plainObject);
        }

        db[collectionName] = collection;
        saveDB(db);
        return doc;
    };

    doc.populate = async function(pathStr, selectStr) {
        const db = loadDB();
        // Path can be 'author', 'replies.user', etc.
        if (pathStr === 'author') {
            const authorId = doc.author ? doc.author.toString() : null;
            if (authorId) {
                const user = db.users.find(u => u._id === authorId);
                if (user) {
                    doc.author = createDocument('users', user);
                    if (selectStr) {
                        const fields = selectStr.split(' ');
                        const masked = {};
                        fields.forEach(f => {
                            if (f in doc.author) masked[f] = doc.author[f];
                        });
                        masked._id = doc.author._id;
                        doc.author = masked;
                    }
                }
            }
        } else if (pathStr === 'replies.user') {
            if (Array.isArray(doc.replies)) {
                doc.replies.forEach(reply => {
                    const userId = reply.user ? reply.user.toString() : null;
                    if (userId) {
                        const user = db.users.find(u => u._id === userId);
                        if (user) {
                            reply.user = createDocument('users', user);
                        }
                    }
                });
            }
        }
        return doc;
    };

    doc.toObject = function() {
        const obj = { ...doc };
        delete obj.save;
        delete obj.populate;
        delete obj.toObject;
        if (obj._id instanceof ObjectId) {
            obj._id = obj._id.toString();
        }
        if (obj.author && obj.author._id instanceof ObjectId) {
            obj.author._id = obj.author._id.toString();
        }
        if (Array.isArray(obj.replies)) {
            obj.replies = obj.replies.map(reply => {
                const r = { ...reply };
                if (r.user && r.user._id instanceof ObjectId) {
                    r.user._id = r.user._id.toString();
                } else if (r.user instanceof ObjectId) {
                    r.user = r.user.toString();
                }
                return r;
            });
        }
        return obj;
    };

    doc.toJSON = function() {
        return doc.toObject();
    };

    return doc;
}

class Query {
    constructor(collectionName, filter = {}) {
        this.collectionName = collectionName;
        this.filter = filter;
        this._populate = [];
        this._sort = null;
        this._limit = null;
        this._select = null;
    }

    populate(pathStr, selectStr) {
        this._populate.push({ pathStr, selectStr });
        return this;
    }

    sort(sortObj) {
        this._sort = sortObj;
        return this;
    }

    select(fields) {
        this._select = fields;
        return this;
    }

    limit(n) {
        this._limit = n;
        return this;
    }

    lean() {
        this._lean = true;
        return this;
    }

    async exec() {
        const db = loadDB();
        let items = db[this.collectionName] || [];

        // Apply filters
        items = items.filter(item => {
            for (const key in this.filter) {
                if (key === '$or') {
                    const orFilters = this.filter.$or;
                    const matchesAny = orFilters.some(subFilter => {
                        for (const subKey in subFilter) {
                            const val = item[subKey];
                            const cond = subFilter[subKey];
                            if (cond && cond.$regex) {
                                const regex = new RegExp(cond.$regex, cond.$options || 'i');
                                if (regex.test(val)) return true;
                            } else if (val === cond) {
                                return true;
                            }
                        }
                        return false;
                    });
                    if (!matchesAny) return false;
                } else {
                    const val = item[key];
                    const cond = this.filter[key];
                    if (cond && typeof cond === 'object' && '$gte' in cond) {
                        if (new Date(val) < new Date(cond.$gte)) return false;
                    } else if (cond instanceof ObjectId) {
                        if (val !== cond.toString()) return false;
                    } else if (val !== cond) {
                        return false;
                    }
                }
            }
            return true;
        });

        // Apply sort
        if (this._sort) {
            items.sort((a, b) => {
                for (const key in this._sort) {
                    const dir = this._sort[key];
                    let valA = a[key];
                    let valB = b[key];
                    if (key === 'createdAt' || key === 'updatedAt' || key === 'datetime' || key === 'needUntil') {
                        valA = new Date(valA || 0).getTime();
                        valB = new Date(valB || 0).getTime();
                    }
                    if (valA < valB) return dir === -1 ? 1 : -1;
                    if (valA > valB) return dir === -1 ? -1 : 1;
                }
                return 0;
            });
        }

        // Apply limit
        if (this._limit !== null) {
            items = items.slice(0, this._limit);
        }

        // Convert to documents
        let docs = items.map(item => createDocument(this.collectionName, item));

        // Populate
        for (const doc of docs) {
            for (const pop of this._populate) {
                await doc.populate(pop.pathStr, pop.selectStr);
            }
        }

        // Apply select
        if (this._select) {
            const fields = typeof this._select === 'string' 
                ? this._select.split(' ') 
                : Object.keys(this._select);
            
            docs = docs.map(doc => {
                const plain = doc.toObject();
                const masked = { _id: plain._id };
                fields.forEach(f => {
                    if (f in plain) masked[f] = plain[f];
                });
                return masked;
            });
        }

        if (this._lean) {
            return docs.map(d => typeof d.toObject === 'function' ? d.toObject() : d);
        }

        return docs;
    }

    // Thenable implementation to support await query
    then(onFulfilled, onRejected) {
        return this.exec().then(onFulfilled, onRejected);
    }
}

const mockMongoose = {
    connect: async function(uri) {
        console.log('[MOCK DB] Connected to local in-memory/JSON-file database successfully.');
        
        // Initialize default seed data if database is empty
        const db = loadDB();
        if (!db.users || db.users.length === 0) {
            console.log('[MOCK DB] Initializing seed data in db.json...');
            
            // Seed Users
            const users = [
                { _id: 'user_kiransharma', collegeId: '22BCE1234', name: 'Kiran Sharma', karma: 312, role: 'student' },
                { _id: 'user_priyanair', collegeId: '23ECE4321', name: 'Priya Nair', karma: 247, role: 'student' },
                { _id: 'user_rahulverma', collegeId: '21MEC5678', name: 'Rahul Verma', karma: 189, role: 'student' },
                { _id: 'user_ananyasingh', collegeId: '24CIV8765', name: 'Ananya Singh', karma: 134, role: 'student' }
            ];

            const now = new Date();
            const posts = [
                {
                    _id: 'post_1',
                    type: 'lost',
                    title: 'Student ID Card',
                    category: 'ID Cards',
                    description: 'Lost my ID card near the canteen. It has a blue lanyard.',
                    location: 'Canteen',
                    datetime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
                    status: 'open',
                    isUrgent: true,
                    author: 'user_ananyasingh',
                    replies: [],
                    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    _id: 'post_2',
                    type: 'found',
                    title: 'Scientific Calculator (Casio FX-991ES)',
                    category: 'Electronics',
                    description: 'Found on the 3rd bench in Physics Lab.',
                    location: 'Department Lab',
                    datetime: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
                    status: 'open',
                    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&h=500&fit=crop',
                    author: 'user_rahulverma',
                    replies: [],
                    createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString()
                },
                {
                    _id: 'post_3',
                    type: 'borrow',
                    title: 'Engineering Drafter',
                    category: 'Stationery',
                    description: 'Need a drafter for my EG class in 30 mins!',
                    location: '1st Year Block',
                    datetime: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
                    needUntil: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                    status: 'open',
                    isUrgent: true,
                    author: 'user_priyanair',
                    replies: [],
                    createdAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
                    updatedAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString()
                }
            ];

            saveDB({ users, posts });
        }
        
        return true;
    },
    Schema,
    Types: { ObjectId },
    connection: {
        on: (event, cb) => {
            if (event === 'connected') cb();
        },
        once: (event, cb) => {
            if (event === 'open') cb();
        }
    },
    model: function(name, schema) {
        const collectionName = name.toLowerCase() + 's';
        
        // Define Model class
        const Model = function(data) {
            return createDocument(collectionName, data);
        };

        // Static methods
        Model.find = function(query) {
            return new Query(collectionName, query);
        };

        Model.findOne = async function(query) {
            const results = await new Query(collectionName, query).exec();
            return results[0] || null;
        };

        Model.findById = async function(id) {
            const results = await new Query(collectionName, { _id: id.toString() }).exec();
            return results[0] || null;
        };

        Model.create = async function(data) {
            const doc = createDocument(collectionName, data);
            await doc.save();
            return doc;
        };

        Model.insertMany = async function(array) {
            const docs = array.map(item => createDocument(collectionName, item));
            const db = loadDB();
            const collection = db[collectionName] || [];
            
            docs.forEach(doc => {
                collection.push(doc.toObject());
            });

            db[collectionName] = collection;
            saveDB(db);
            return docs;
        };

        Model.deleteMany = async function(query) {
            const db = loadDB();
            // Simple delete all
            if (!query || Object.keys(query).length === 0) {
                db[collectionName] = [];
            } else {
                let collection = db[collectionName] || [];
                collection = collection.filter(item => {
                    for (const key in query) {
                        if (item[key] !== query[key]) return true;
                    }
                    return false;
                });
                db[collectionName] = collection;
            }
            saveDB(db);
            return { deletedCount: 0 };
        };

        return Model;
    }
};

module.exports = mockMongoose;
