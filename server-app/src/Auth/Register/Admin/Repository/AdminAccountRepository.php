<?php

namespace App\Auth\Register\Admin\Repository;

use App\Auth\Register\Admin\Entity\AdminAccount;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class AdminAccountRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AdminAccount::class);
    }

    public function existsByEmail(string $email): bool
    {
        return $this->findOneBy(['email' => $email]) !== null;
    }
}
