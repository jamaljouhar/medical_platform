<?php

namespace App\Auth\Register\Client\Repository;

use App\Auth\Register\Client\Entity\UserAccount;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserAccountRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserAccount::class);
    }

    public function existsByEmail(string $email): bool
    {
        return $this->findOneBy(['email' => $email]) !== null;
    }
}