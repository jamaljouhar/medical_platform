<?php

namespace App\MedicalRecord\Service;

use App\Appointment\Repository\AppointmentRepository;
use App\Doctor\Repository\DoctorRepository;
use App\MedicalRecord\Dto\MedicalRecordRequestDto;
use App\MedicalRecord\Dto\MedicalRecordResponseDto;
use App\MedicalRecord\Entity\MedicalRecord;
use App\MedicalRecord\Mapper\MedicalRecordMapper;
use App\MedicalRecord\Repository\MedicalRecordRepository;
use App\Patient\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MedicalRecordServiceImpl implements MedicalRecordService
{
    public function __construct(
        private readonly MedicalRecordRepository $medicalRecordRepository,
        private readonly PatientRepository $patientRepository,
        private readonly DoctorRepository $doctorRepository,
        private readonly AppointmentRepository $appointmentRepository,
        private readonly MedicalRecordMapper $medicalRecordMapper,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function create(
        MedicalRecordRequestDto $dto
    ): MedicalRecordResponseDto {
        $patient = $this->patientRepository->find($dto->patientId);

        if ($patient === null) {
            throw new NotFoundHttpException('Patient introuvable.');
        }

        $doctor = $this->doctorRepository->find($dto->doctorId);

        if ($doctor === null) {
            throw new NotFoundHttpException('Médecin introuvable.');
        }

        $appointment = $this->findAppointment(
            $dto->appointmentId,
            $patient->getId(),
            $doctor->getId()
        );

        $medicalRecord = new MedicalRecord();

        $this->medicalRecordMapper->updateEntity(
            $medicalRecord,
            $dto,
            $patient,
            $doctor,
            $appointment
        );

        $this->entityManager->persist($medicalRecord);
        $this->entityManager->flush();

        return $this->medicalRecordMapper->toResponseDto(
            $medicalRecord
        );
    }

    public function getById(
        int $id
    ): MedicalRecordResponseDto {
        $medicalRecord = $this->findMedicalRecord($id);

        return $this->medicalRecordMapper->toResponseDto(
            $medicalRecord
        );
    }

    public function getAll(): array
    {
        $records = $this->medicalRecordRepository->findBy(
            [],
            ['recordDate' => 'DESC', 'id' => 'DESC']
        );

        return array_map(
            fn (MedicalRecord $record) =>
                $this->medicalRecordMapper->toResponseDto($record),
            $records
        );
    }

    public function getByPatientId(int $patientId): array
    {
        $patient = $this->patientRepository->find($patientId);

        if ($patient === null) {
            throw new NotFoundHttpException('Patient introuvable.');
        }

        $records = $this->medicalRecordRepository
            ->findByPatientOrderedByDate($patient);

        return array_map(
            fn (MedicalRecord $record) =>
                $this->medicalRecordMapper->toResponseDto($record),
            $records
        );
    }

    public function update(
        int $id,
        MedicalRecordRequestDto $dto
    ): MedicalRecordResponseDto {
        $medicalRecord = $this->findMedicalRecord($id);

        $patient = $this->patientRepository->find($dto->patientId);

        if ($patient === null) {
            throw new NotFoundHttpException('Patient introuvable.');
        }

        $doctor = $this->doctorRepository->find($dto->doctorId);

        if ($doctor === null) {
            throw new NotFoundHttpException('Médecin introuvable.');
        }

        $appointment = $this->findAppointment(
            $dto->appointmentId,
            $patient->getId(),
            $doctor->getId()
        );

        $this->medicalRecordMapper->updateEntity(
            $medicalRecord,
            $dto,
            $patient,
            $doctor,
            $appointment
        );

        $this->entityManager->flush();

        return $this->medicalRecordMapper->toResponseDto(
            $medicalRecord
        );
    }

    public function delete(int $id): void
    {
        $medicalRecord = $this->findMedicalRecord($id);

        $this->entityManager->remove($medicalRecord);
        $this->entityManager->flush();
    }

    private function findMedicalRecord(int $id): MedicalRecord
    {
        $medicalRecord = $this->medicalRecordRepository->find($id);

        if ($medicalRecord === null) {
            throw new NotFoundHttpException(
                'Dossier médical introuvable.'
            );
        }

        return $medicalRecord;
    }

    private function findAppointment(
        ?int $appointmentId,
        ?int $patientId,
        ?int $doctorId
    ): ?\App\Appointment\Entity\Appointment {
        if ($appointmentId === null) {
            return null;
        }

        $appointment = $this->appointmentRepository->find(
            $appointmentId
        );

        if ($appointment === null) {
            throw new NotFoundHttpException(
                'Rendez-vous introuvable.'
            );
        }

        if (
            $appointment->getPatient()?->getId() !== $patientId
            || $appointment->getDoctor()?->getId() !== $doctorId
        ) {
            throw new BadRequestHttpException(
                'Le rendez-vous ne correspond pas au patient et au médecin.'
            );
        }

        return $appointment;
    }
}
