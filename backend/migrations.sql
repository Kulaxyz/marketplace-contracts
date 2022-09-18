CREATE TABLE IF NOT EXISTS `listing_added`
(
    `hash` varchar(255) NOT NULL,
    `token_id`     varchar(255)     NOT NULL,
    `price`   bigint         NOT NULL,
    `address` varchar(255)  NOT NULL,
    `seller` varchar(255)  NOT NULL,
    PRIMARY KEY (token_id, address)
    ) ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `listing_cancelled`
(
    `hash` varchar(255) NOT NULL,
    `token_id`     varchar(255)     NOT NULL,
    `address` varchar(255)  NOT NULL,
    PRIMARY KEY (token_id, address)
    ) ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `nft_bought`
(
    `hash` varchar(255) NOT NULL,
    `token_id`     varchar(255)     NOT NULL,
    `price`   bigint         NOT NULL,
    `address` varchar(255)  NOT NULL,
    `buyer` varchar(255)  NOT NULL,
    PRIMARY KEY (token_id, address)
    ) ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `listing_price_updated`
(
    `hash` varchar(255) NOT NULL,
    `token_id`     varchar(255)     NOT NULL,
    `new_price`   bigint         NOT NULL,
    `address` varchar(255)  NOT NULL,
    PRIMARY KEY (token_id, address)
    ) ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `active_listings`
(
    `hash` varchar(255) NOT NULL,
    `token_id`     varchar(255)     NOT NULL,
    `price`   bigint         NOT NULL,
    `address` varchar(255)  NOT NULL,
    `seller` varchar(255)  NOT NULL,
    PRIMARY KEY (token_id, address)
    ) ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4;