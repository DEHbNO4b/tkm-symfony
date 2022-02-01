<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220131132203 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE news_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE news_images_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE nodes_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE persons_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE qwerty_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE tree_subscription_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE trees_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE users_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE news (id INT NOT NULL, user_id INT NOT NULL, status INT NOT NULL, header VARCHAR(255) NOT NULL, text VARCHAR(255) NOT NULL, video VARCHAR(255) NOT NULL, date_added TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, tree_id INT NOT NULL, last_update TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE news_images (id INT NOT NULL, news_id INT NOT NULL, path VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE nodes (id INT NOT NULL, tree_id INT NOT NULL, parent_id INT NOT NULL, person_id INT NOT NULL, spouse_id INT NOT NULL, date_added TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, invite_hash VARCHAR(25) NOT NULL, user_id INT NOT NULL, last_update TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, deleted INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE persons (id INT NOT NULL, name VARCHAR(40) NOT NULL, gender VARCHAR(255) NOT NULL, photo VARCHAR(255) NOT NULL, birth_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, dead_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, date_added TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_update TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE qwerty (id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE tree_subscription (id INT NOT NULL, user_id INT NOT NULL, tree_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE trees (id INT NOT NULL, family VARCHAR(40) NOT NULL, admin_id INT NOT NULL, nationality VARCHAR(40) NOT NULL, date_added TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_update TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE user_roles (user_id INT NOT NULL, role_id INT NOT NULL, PRIMARY KEY(user_id))');
        $this->addSql('CREATE TABLE users (id INT NOT NULL, firstname VARCHAR(20) NOT NULL, lastname VARCHAR(30) NOT NULL, password_hash VARCHAR(100) NOT NULL, password_salt VARCHAR(255) DEFAULT NULL, phone VARCHAR(40) NOT NULL, email VARCHAR(100) NOT NULL, date_added TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_update TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9444F97DD ON users (phone)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE news_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE news_images_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE nodes_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE persons_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE qwerty_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE tree_subscription_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE trees_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE users_id_seq CASCADE');
        $this->addSql('DROP TABLE news');
        $this->addSql('DROP TABLE news_images');
        $this->addSql('DROP TABLE nodes');
        $this->addSql('DROP TABLE persons');
        $this->addSql('DROP TABLE qwerty');
        $this->addSql('DROP TABLE tree_subscription');
        $this->addSql('DROP TABLE trees');
        $this->addSql('DROP TABLE user_roles');
        $this->addSql('DROP TABLE users');
    }
}
