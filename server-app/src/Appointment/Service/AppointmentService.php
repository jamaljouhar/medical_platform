<?php

namespace App\Appointment\Service;

use App\Appointment\Dto\AppointmentRequestDto;
use App\Appointment\Dto\AppointmentResponseDto;
use App\Appointment\Dto\AppointmentUpdateRequestDto;
use App\Appointment\Entity\Appointment;
use App\Appointment\Enum\AppointmentStatus;
use App\Appointment\Mapper\AppointmentMapper;
use App\Appointment\Repository\AppointmentRepository;
use App\Doctor\Repository\DoctorRepository;
use App\Patient\Entity\Patient;
use App\Shared\Exception\ValidationException;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AppointmentService
{
    public function __construct(
        private AppointmentRepository $appointmentRepository,
        private DoctorRepository $doctorRepository,
        private EntityManagerInterface $entityManager,
        private AppointmentMapper $appointmentMapper,
        private ValidatorInterface $validator,
    ) {}


    public function getAppointmentsByPatient(
        Patient $patient
    ): array {
        $appointments = $this->appointmentRepository
            ->findByPatient($patient);

        return array_map(
            fn(Appointment $appointment): AppointmentResponseDto =>
            $this->appointmentMapper->toResponseDto($appointment),
            $appointments
        );
    }

    public function createAppointment(
        AppointmentRequestDto $request,
        Patient $patient
    ): AppointmentResponseDto {
        $this->validateDto($request);

        $doctor = $this->doctorRepository->find(
            $request->doctorId
        );

        if (!$doctor) {
            throw new NotFoundHttpException('Doctor not found.');
        }

        $appointment = new Appointment();

        $appointment
            ->setPatient($patient)
            ->setDoctor($doctor)
            ->setAppointmentDate(
                new DateTimeImmutable($request->appointmentDate)
            )
            ->setReason($request->reason)
            ->setStatus(AppointmentStatus::PENDING);

        $this->entityManager->persist($appointment);
        $this->entityManager->flush();

        return $this->appointmentMapper->toResponseDto($appointment);
    }


    public function getAppointmentById(
        int $id
    ): AppointmentResponseDto {
        $appointment = $this->findAppointmentOrFail($id);

        return $this->appointmentMapper
            ->toResponseDto($appointment);
    }

    public function getAllAppointments(): array
    {
        $appointments = $this->appointmentRepository->findAll();

        return array_map(
            fn(Appointment $appointment): AppointmentResponseDto =>
            $this->appointmentMapper->toResponseDto($appointment),
            $appointments
        );
    }

    public function updateAppointmentStatus(
        int $id,
        AppointmentStatus $status
    ): AppointmentResponseDto {
        $appointment = $this->findAppointmentOrFail($id);

        $appointment->setStatus($status);

        $this->entityManager->flush();

        return $this->appointmentMapper
            ->toResponseDto($appointment);
    }

    
public function updateAppointment(
    int $id,
    AppointmentUpdateRequestDto $request,
    Patient $patient
): AppointmentResponseDto {
    $this->validateDto($request);

    $appointment = $this->findAppointmentOrFail($id);

    if ($appointment->getPatient()?->getId() !== $patient->getId()) {
        throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException(
            'You are not allowed to modify this appointment.'
        );
    }

    if ($appointment->getStatus() !== AppointmentStatus::PENDING) {
        throw new \Symfony\Component\HttpKernel\Exception\BadRequestHttpException(
            'Only pending appointments can be modified.'
        );
    }

    $appointment
        ->setAppointmentDate(
            new DateTimeImmutable($request->appointmentDate)
        )
        ->setReason($request->reason);

    $this->entityManager->flush();

    return $this->appointmentMapper->toResponseDto($appointment);
}


    public function deleteAppointment(int $id): void
    {
        $appointment = $this->findAppointmentOrFail($id);

        $this->entityManager->remove($appointment);
        $this->entityManager->flush();
    }

    private function findAppointmentOrFail(
        int $id
    ): Appointment {
        $appointment = $this->appointmentRepository->find($id);

        if (!$appointment) {
            throw new NotFoundHttpException(
                'Appointment not found.'
            );
        }

        return $appointment;
    }

    
private function validateDto(object $dto): void
{
    $errors = $this->validator->validate($dto);

    if (count($errors) === 0) {
        return;
    }

    $validationErrors = [];

    foreach ($errors as $error) {
        $validationErrors[$error->getPropertyPath()][] =
            $error->getMessage();
    }

    throw new ValidationException($validationErrors);
}

}
