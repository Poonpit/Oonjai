const USER_SCHEMA = `
    users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM("PATIENT", "DOCTOR", "ADMIN"),
        is_verified BOOLEAN DEFAULT FALSE,
        birthday DATE,
        personal_information VARCHAR(2048),
        unread_notification INT DEFAULT 0,
        banned_questions INT,
        created_at DATETIME DEFAULT NOW(),
        INDEX(email)
    )
`;

const PROFILE_IMAGE_SCHEMA = `
    profile_images (
        user_id VARCHAR(255) NOT NULL,
        url VARCHAR(255) DEFAULT "/unknown-profile-image.jpg",
        image_id VARCHAR(255),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`;

const TOPIC_SCHEMA = `
    topics (
        id VARCHAR(255) PRIMARY KEY,
        topic VARCHAR(255) NOT NULL
    )
`;

const INTERESTED_IN_SCHEMA = `
    interested_in (
        user_id VARCHAR(255) NOT NULL,
        topic_id VARCHAR(255) NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
    )
`;

const ASSESSMENT_SCHEMA = `
    assessments (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        type ENUM("MENTAL", "COVID"),
        result INT NOT NULL,
        created_at DATETIME DEFAULT NOW(),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`;

const BLOG_SCHEMA = `
    blogs (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(512) NOT NULL,
        content VARCHAR(1024) NOT NULL,
        views INT DEFAULT 0,
        topic_id VARCHAR(255),
        user_id VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT NOW(),
        FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE SET NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`;

const BLOG_IMAGE_SCHEMA = `
    blog_images (
        blog_id VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        image_id VARCHAR(255) NOT NULL,
        FOREIGN KEY(blog_id) REFERENCES blogs(id) ON DELETE CASCADE
    )
`;

const QUESTION_SCHEMA = `
    questions (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(512) NOT NULL,
        content VARCHAR(1024) NOT NULL,
        views INT DEFAULT 0,
        topic_id VARCHAR(255),
        user_id VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT NOW(),
        FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE SET NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`;

const ANSWER_SCHEMA = `
    answers (
        id VARCHAR(255) PRIMARY KEY,
        question_id VARCHAR(255),
        content VARCHAR(1024) NOT NULL,
        replied_to VARCHAR(255),
        user_id VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT NOW(),
        FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE,
        FOREIGN KEY(replied_to) REFERENCES answers(id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`;

const NOTIFICATION_SCHEMA = `
    notifications (
        id VARCHAR(255) PRIMARY KEY,
        type ENUM("BLOG", "QUESTION", "ANSWER", "REPLY", "QUESTION_BANNED"),
        blog_id VARCHAR(255),
        question_id VARCHAR(255),
        user_id VARCHAR(255),
        created_at DATETIME DEFAULT NOW(),
        FOREIGN KEY(blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
        FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`

module.exports = {
    USER_SCHEMA,
    PROFILE_IMAGE_SCHEMA,
    TOPIC_SCHEMA,
    INTERESTED_IN_SCHEMA,
    ASSESSMENT_SCHEMA,
    BLOG_SCHEMA,
    BLOG_IMAGE_SCHEMA,
    QUESTION_SCHEMA,
    ANSWER_SCHEMA,
    NOTIFICATION_SCHEMA
};
