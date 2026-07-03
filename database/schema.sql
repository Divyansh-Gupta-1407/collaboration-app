--basic schema
-- 1. Store your users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Never store plain text!
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Store the documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT, -- For Phase 1, we just store the text here
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Manage who can edit what (Role-Based Permissions)
CREATE TABLE document_collaborators (
    document_id INTEGER REFERENCES documents(id),
    user_id INTEGER REFERENCES users(id),
    role VARCHAR(20) CHECK (role IN ('viewer', 'editor')),
    PRIMARY KEY (document_id, user_id)
);
