<?php

namespace App\MedicalRecord\Mapper;

use App\Appointment\Entity\Appointment;
use App\Doctor\Entity\Doctor;
use App\MedicalRecord\Dto\MedicalRecordRequestDto;
use App\MedicalRecord\Dto\MedicalRecordResponseDto;
use App\MedicalRecord\Entity\MedicalRecord;
use App\Patient\Entity\Patient;

class MedicalRecordMapper
{
    
    public function toResponseDto(
        MedicalRecord $medicalRecord
    ): MedicalRecordResponseDto {
        return new MedicalRecordResponseDto(
            id: $medicalRecord->getId(),
            patientId: $medicalRecord->getPatient()->getId(),
            patientName: $medicalRecord->getPatient()->getFullname(),
            doctorId: $medicalRecord->getDoctor()->getId(),
            doctorName: $this->getDoctorName($medicalRecord->getDoctor()),
            appointmentId: $medicalRecord->getAppointment()?->getId(),
            diagnosis: $medicalRecord->getDiagnosis(),
            medicalHistory: $medicalRecord->getMedicalHistory(),
            allergies: $medicalRecord->getAllergies(),
            notes: $medicalRecord->getNotes(),
            recordDate: $medicalRecord->getRecordDate()?->format('Y-m-d'),
            createdAt: $medicalRecord->getCreatedAt()?->format(
                'Y-m-d H:i:s'
            ),
            updatedAt: $medicalRecord->getUpdatedAt()?->format(
                'Y-m-d H:i:s'
            ),
        );
    }

    public function updateEntity(
        MedicalRecord $medicalRecord,
        MedicalRecordRequestDto $dto,
        Patient $patient,
        Doctor $doctor,
        ?Appointment $appointment
    ): MedicalRecord {
        $medicalRecord
            ->setPatient($patient)
            ->setDoctor($doctor)
            ->setAppointment($appointment)
            ->setDiagnosis($dto->diagnosis)
            ->setMedicalHistory($dto->medicalHistory)
            ->setAllergies($dto->allergies)
            ->setNotes($dto->notes);

        if ($dto->recordDate !== null) {
            $medicalRecord->setRecordDate(
                new \DateTimeImmutable($dto->recordDate)
            );
        }

        return $medicalRecord;
    }

    
    private function getDoctorName(Doctor $doctor): ?string
    {
        return $doctor->getFullName();
    }
}
