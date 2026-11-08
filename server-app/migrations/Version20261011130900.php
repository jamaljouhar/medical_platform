<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261011130900 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE doctor ADD full_name VARCHAR(150) NOT NULL');
        $this->addSql('ALTER TABLE doctor ADD age INT DEFAULT NULL');
        $this->addSql('ALTER TABLE doctor ADD date_of_birth DATE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE doctor DROP full_name');
        $this->addSql('ALTER TABLE doctor DROP age');
        $this->addSql('ALTER TABLE doctor DROP date_of_birth');
    }
}
