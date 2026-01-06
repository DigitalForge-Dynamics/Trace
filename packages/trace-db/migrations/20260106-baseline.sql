BEGIN TRANSACTION;

CREATE TABLE users (
    uid BINARY(16) PRIMARY KEY NOT NULL,
    username STRING NOT NULL
);

CREATE TABLE idps (
    uid BINARY(16) PRIMARY KEY NOT NULL,
    issuer URL NOT NULL,
    label STRING NOT NULL,
    audience STRING NOT NULL,
    subject STRING NOT NULL,
    UNIQUE (issuer)
);

CREATE TABLE user_idps (
    idp BINARY(16) NOT NULL,
    sub STRING NOT NULL,
    user BINARY(16) NOT NULL,
    PRIMARY KEY (idp, sub),
    FOREIGN KEY (idp) REFERENCES idps(uid),
    FOREIGN KEY (user) REFERENCES users(uid)
);

CREATE TABLE locations (
    uid BINARY(16) PRIMARY KEY NOT NULL,
    name STRING NOT NULL
);

CREATE TABLE assets (
    uid BINARY(16) PRIMARY KEY NOT NULL,
    location BINARY(16) NOT NULL,
    user BINARY(16) DEFAULT NULL,
    FOREIGN KEY (location) REFERENCES locations(uid),
    FOREIGN KEY (user) REFERENCES users(uid)
);

CREATE TABLE asset_movements (
    asset BINARY(16) NOT NULL,
    location BINARY(16) NOT NULL,
    timestamp INT(32) NOT NULL,
    PRIMARY KEY (asset, location, timestamp),
    FOREIGN KEY (asset) REFERENCES assets(uid),
    FOREIGN KEY (location) REFERENCES locations(uid)
);

CREATE TABLE asset_assignments (
    asset BINARY(16) NOT NULL,
    user BINARY(16) NOT NULL,
    timestamp INT(32) NOT NULL,
    PRIMARY KEY (asset, user, timestamp),
    FOREIGN KEY (asset) REFERENCES assets(uid),
    FOREIGN KEY (user) REFERENCES users(uid)
);

COMMIT TRANSACTION;
