<?php

namespace App\Appointment\Controller;

use App\Appointment\Dto\AppointmentRequestDto;
use App\Appointment\Dto\AppointmentUpdateRequestDto;
use App\Appointment\Enum\AppointmentStatus;
use App\Appointment\Service\AppointmentService;
use App\Auth\Register\Client\Entity\UserAccount;
use App\Patient\Entity\Patient;
use App\Patient\Repository\PatientRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[Route('/api/appointments', name: 'api_appointments_')]
class AppointmentController extends AbstractController
{
    public function __construct(
        private AppointmentService $appointmentService,
        private SerializerInterface $serializer,
        private PatientRepository $patientRepository,
    ) {}


    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] AppointmentRequestDto $request
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user instanceof UserAccount) {
            return $this->json([
                'success' => false,
                'message' => 'Utilisateur authentifié introuvable.',
            ], Response::HTTP_FORBIDDEN);
        }

        $patient = $this->patientRepository
            ->findByUserAccountId($user->getId());

        if (!$patient instanceof Patient) {
            return $this->json([
                'success' => false,
                'message' => 'Aucun patient associé à ce compte.',
            ], Response::HTTP_NOT_FOUND);
        }

        $appointment = $this->appointmentService
            ->createAppointment($request, $patient);

        return new JsonResponse(
            $this->serializer->serialize($appointment, 'json'),
            Response::HTTP_CREATED,
            [],
            true
        );
    }

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $appointments = $this->appointmentService
            ->getAllAppointments();

        return new JsonResponse(
            $this->serializer->serialize(
                $appointments,
                'json'
            ),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/me', name: 'appointment_mine', methods: ['GET'])]
    public function mine(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof UserAccount) {
            return $this->json(
                ['message' => 'Accès refusé'],
                Response::HTTP_FORBIDDEN
            );
        }

        $patient = $this->patientRepository
            ->findByUserAccountId($user->getId());

        if (!$patient) {
            return $this->json(
                ['message' => 'Patient introuvable'],
                Response::HTTP_NOT_FOUND
            );
        }

        $appointments = $this->appointmentService
            ->getAppointmentsByPatient($patient);

        return $this->json($appointments, Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $appointment = $this->appointmentService
            ->getAppointmentById($id);

        return new JsonResponse(
            $this->serializer->serialize(
                $appointment,
                'json'
            ),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route(
        '/{id}/status',
        name: 'update_status',
        methods: ['PATCH']
    )]
    public function updateStatus(
        int $id,
        Request $request
    ): JsonResponse {
        $data = $request->toArray();

        $status = AppointmentStatus::tryFrom(
            $data['status'] ?? ''
        );

        if ($status === null) {
            return $this->json([
                'message' => 'Invalid appointment status.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $appointment = $this->appointmentService
            ->updateAppointmentStatus($id, $status);

        return new JsonResponse(
            $this->serializer->serialize(
                $appointment,
                'json'
            ),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user instanceof UserAccount) {
            throw new AccessDeniedHttpException(
                'An authenticated patient is required.'
            );
        }

        $patient = $this->patientRepository
            ->findByUserAccountId($user->getId());

        if (!$patient) {
            throw new NotFoundHttpException(
                'Patient profile not found.'
            );
        }

        $updateRequest = $this->serializer->deserialize(
            $request->getContent(),
            AppointmentUpdateRequestDto::class,
            'json'
        );

        $appointment = $this->appointmentService->updateAppointment(
            $id,
            $updateRequest,
            $patient
        );

        return $this->json($appointment);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->appointmentService->deleteAppointment($id);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
