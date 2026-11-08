<?php

namespace App\Shared\Exception;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use App\Shared\Exception\ValidationException;

class ExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => 'onException',
        ];
    }

    public function onException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $statusCode = 500;

        if ($exception instanceof HttpExceptionInterface) {
            $statusCode = $exception->getStatusCode();
        }

        $response = [
            'success' => false,
            'message' => $exception->getMessage(),
            'status' => $statusCode,
        ];

        if ($exception instanceof ValidationException) {
            $response['errors'] = $exception->getErrors();
        }

        $event->setResponse(
            new JsonResponse($response, $statusCode)
        );
    }
}
