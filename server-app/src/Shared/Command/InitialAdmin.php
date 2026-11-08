<?php

namespace App\Shared\Command;

use App\Auth\Register\Admin\Entity\AdminAccount;
use App\Auth\Register\Admin\Enum\AdminRole;
use App\Auth\Register\Admin\Repository\AdminAccountRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-initial-admin',
    description: 'Create the initial administrator if none exists.'
)]
class InitialAdmin extends Command
{
    public function __construct(
        private AdminAccountRepository $adminRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function execute(
        InputInterface $input,
        OutputInterface $output
    ): int {
        $io = new SymfonyStyle($input, $output);

        if ($this->adminRepository->count([]) > 0) {
            $io->info('An account already exists. No admin created.');

            return Command::SUCCESS;
        }

        $admin = new AdminAccount();
        $admin->setEmail('admin@gmail.com');
        $admin->setPassword(
            $this->passwordHasher->hashPassword(
                $admin,
                'Admin12345'
            )
        );
        $admin->setRole(AdminRole::ADMIN);
        $admin->setEnabled(true);

        $this->entityManager->persist($admin);
        $this->entityManager->flush();

        $io->success('Initial admin account created.');

        return Command::SUCCESS;
    }
}
