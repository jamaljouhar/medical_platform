<?php

namespace App\Prescription\Service;

use App\MedicalRecord\Repository\MedicalRecordRepository;
use App\Prescription\Dto\PrescriptionRequestDto;
use App\Prescription\Dto\PrescriptionResponseDto;
use App\Prescription\Entity\Prescription;
use App\Prescription\Entity\PrescriptionMedication;
use App\Prescription\Mapper\PrescriptionMapper;
use App\Prescription\Repository\PrescriptionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PrescriptionService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly PrescriptionRepository $prescriptionRepository,
        private readonly MedicalRecordRepository $medicalRecordRepository,
        private readonly PrescriptionMapper $prescriptionMapper,
    ) {
    }

    public function create(
        PrescriptionRequestDto $request
    ): PrescriptionResponseDto {
        $medicalRecord = $this->medicalRecordRepository->find(
            $request->medicalRecordId
        );

        if (!$medicalRecord) {
            throw new NotFoundHttpException(
                'Le dossier médical demandé est introuvable.'
            );
        }

        $prescription = new Prescription();
        $prescription->setMedicalRecord($medicalRecord);

        $prescription->setPrescriptionDate(
            $request->prescriptionDate !== null
                ? new \DateTimeImmutable($request->prescriptionDate)
                : new \DateTimeImmutable()
        );

        $prescription->setNotes($request->notes);

        foreach ($request->medications ?? [] as $medicationData) {
            $medication = new PrescriptionMedication();
            $medication->setMedicationName($medicationData['medicationName']);
            $medication->setDosage($medicationData['dosage']);
            $medication->setFrequency($medicationData['frequency']);
            $medication->setDuration($medicationData['duration']);
            $medication->setInstructions(
                $medicationData['instructions'] ?? null
            );

            $prescription->addMedication($medication);
        }

        $this->entityManager->persist($prescription);
        $this->entityManager->flush();

        return $this->prescriptionMapper->toResponseDto($prescription);
    }

    public function findById(int $id): PrescriptionResponseDto
    {
        return $this->prescriptionMapper->toResponseDto(
            $this->getPrescriptionOrFail($id)
        );
    }

    public function findAll(): array
    {
        $prescriptions = $this->prescriptionRepository->findAll();

        return array_map(
            fn (Prescription $prescription): PrescriptionResponseDto =>
                $this->prescriptionMapper->toResponseDto($prescription),
            $prescriptions
        );
    }

    public function update(
        int $id,
        PrescriptionRequestDto $request
    ): PrescriptionResponseDto {
        $prescription = $this->getPrescriptionOrFail($id);

        if ($request->medicalRecordId !== null) {
            $medicalRecord = $this->medicalRecordRepository->find(
                $request->medicalRecordId
            );

            if (!$medicalRecord) {
                throw new NotFoundHttpException(
                    'Le dossier médical demandé est introuvable.'
                );
            }

            $prescription->setMedicalRecord($medicalRecord);
        }

        if ($request->prescriptionDate !== null) {
            $prescription->setPrescriptionDate(
                new \DateTimeImmutable($request->prescriptionDate)
            );
        }

        if ($request->notes !== null) {
            $prescription->setNotes($request->notes);
        }

        if ($request->medications !== null) {
            foreach ($prescription->getMedications()->toArray() as $medication) {
                $prescription->removeMedication($medication);
            }

            foreach ($request->medications as $medicationData) {
                $medication = new PrescriptionMedication();
                $medication->setMedicationName($medicationData['medicationName']);
                $medication->setDosage($medicationData['dosage']);
                $medication->setFrequency($medicationData['frequency']);
                $medication->setDuration($medicationData['duration']);
                $medication->setInstructions(
                    $medicationData['instructions'] ?? null
                );

                $prescription->addMedication($medication);
            }
        }

        $this->entityManager->flush();

        return $this->prescriptionMapper->toResponseDto($prescription);
    }

    public function delete(int $id): void
    {
        $prescription = $this->getPrescriptionOrFail($id);

        $this->entityManager->remove($prescription);
        $this->entityManager->flush();
    }

    private function getPrescriptionOrFail(int $id): Prescription
    {
        $prescription = $this->prescriptionRepository->find($id);

        if (!$prescription) {
            throw new NotFoundHttpException(
                sprintf(
                    'La prescription avec l’identifiant %d est introuvable.',
                    $id
                )
            );
        }

        return $prescription;
    }
}
