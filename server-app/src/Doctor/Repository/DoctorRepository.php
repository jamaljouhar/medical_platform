<?php

namespace App\Doctor\Repository;

use App\Doctor\Entity\Doctor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DoctorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Doctor::class);
    }

    public function existsByLicenseNumber(string $licenseNumber): bool
    {
        return $this->findOneBy([
            'licenseNumber' => $licenseNumber,
        ]) !== null;
    }

    public function findByAdminAccountId(int $adminAccountId): ?Doctor
    {
        return $this->findOneBy([
            'adminAccount' => $adminAccountId,
        ]);
    }
}
