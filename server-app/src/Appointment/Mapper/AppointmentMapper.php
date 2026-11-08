<?php

namespace App\Appointment\Mapper;

use App\Appointment\Dto\AppointmentResponseDto;
use App\Appointment\Entity\Appointment;

class AppointmentMapper
{
    public function toResponseDto(
        Appointment $appointment
    ): AppointmentResponseDto {
        $doctor = $appointment->getDoctor();
        $adminAccount = $doctor?->getAdminAccount();

        return new AppointmentResponseDto(
            id: $appointment->getId(),
            appointmentDate: $appointment
                ->getAppointmentDate()
                ->format('Y-m-d H:i:s'),
            reason: $appointment->getReason(),
            status: $appointment->getStatus(),

            patientName: $appointment->getPatient()->getFullname(),

            doctorName: $doctor->getFullName(),
            doctorEmail: $adminAccount?->getEmail(),
            doctorSpecialty: $doctor->getSpecialty()->getName(),
        );
    }
}
