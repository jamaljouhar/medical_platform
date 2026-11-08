<?php

namespace App\MedicalRecord\Service;

use App\MedicalRecord\Dto\MedicalRecordRequestDto;
use App\MedicalRecord\Dto\MedicalRecordResponseDto;

interface MedicalRecordService
{
    public function create(
        MedicalRecordRequestDto $dto
    ): MedicalRecordResponseDto;

    public function getById(
        int $id
    ): MedicalRecordResponseDto;

    /**
     * @return MedicalRecordResponseDto[]
     */
    public function getAll(): array;

    /**
     * @return MedicalRecordResponseDto[]
     */
    public function getByPatientId(
        int $patientId
    ): array;

    public function update(
        int $id,
        MedicalRecordRequestDto $dto
    ): MedicalRecordResponseDto;

    public function delete(int $id): void;
}
