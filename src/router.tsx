import { createBrowserRouter } from "react-router-dom"
import { RootShell } from "@/components/layout/RootShell"
import { ProtectedRoute } from "@/auth/ProtectedRoute"
import { LoginPage } from "@/pages/LoginPage"
import { AcceptInvitePage } from "@/pages/AcceptInvitePage"
import { DashboardPage } from "@/pages/DashboardPage"
import { PlayersPage } from "@/pages/PlayersPage"
import { PlayerFormPage } from "@/pages/PlayerFormPage"
import { PlayerDetailPage } from "@/pages/PlayerDetailPage"
import { PlayerReportPage } from "@/pages/PlayerReportPage"
import { TrainingsPage } from "@/pages/TrainingsPage"
import { TrainingFormPage } from "@/pages/TrainingFormPage"
import { TrainingDetailPage } from "@/pages/TrainingDetailPage"
import { ExerciseLibraryPage } from "@/pages/ExerciseLibraryPage"
import { EvaluationsPage } from "@/pages/EvaluationsPage"
import { EvaluationFormPage } from "@/pages/EvaluationFormPage"
import { EvaluationDetailPage } from "@/pages/EvaluationDetailPage"
import { UsersPage } from "@/pages/UsersPage"
import { RoutinesPage } from "@/pages/RoutinesPage"
import { RoutineFormPage } from "@/pages/RoutineFormPage"
import { RoutineDetailPage } from "@/pages/RoutineDetailPage"
import { CalendarPage } from "@/pages/CalendarPage"
import { NationalsPage } from "@/pages/NationalsPage"
import { NationalFormPage } from "@/pages/NationalFormPage"
import { NationalDetailPage } from "@/pages/NationalDetailPage"
import { MatchDetailPage } from "@/pages/MatchDetailPage"
import { TournamentsPage } from "@/pages/TournamentsPage"
import { TournamentDetailPage } from "@/pages/TournamentDetailPage"
import { PhysicalTestsPage } from "@/pages/PhysicalTestsPage"
import { SecurityCheckPage } from "@/pages/SecurityCheckPage"
import { BecadosPage } from "@/pages/BecadosPage"
import { IndividualPlansPage } from "@/pages/IndividualPlansPage"
import { IndividualPlanFormPage } from "@/pages/IndividualPlanFormPage"

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/aceptar-invitacion", element: <AcceptInvitePage /> },
  { path: "/seguridad", element: <SecurityCheckPage /> },
  {
    element: (
      <ProtectedRoute>
        <RootShell />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <DashboardPage /> },
      {
        path: "/users",
        element: (
          <ProtectedRoute allow={["dt"]}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/becados",
        element: (
          <ProtectedRoute allow={["dt"]}>
            <BecadosPage />
          </ProtectedRoute>
        ),
      },
      { path: "/players", element: <PlayersPage /> },
      { path: "/players/new", element: <PlayerFormPage /> },
      { path: "/players/:id", element: <PlayerDetailPage /> },
      { path: "/players/:id/edit", element: <PlayerFormPage /> },
      { path: "/players/:id/report", element: <PlayerReportPage /> },
      { path: "/calendar", element: <CalendarPage /> },
      { path: "/matches/:id", element: <MatchDetailPage /> },
      { path: "/torneos", element: <TournamentsPage /> },
      { path: "/torneos/:id", element: <TournamentDetailPage /> },
      { path: "/physical-tests", element: <PhysicalTestsPage /> },
      { path: "/trainings", element: <TrainingsPage /> },
      { path: "/trainings/new", element: <TrainingFormPage /> },
      { path: "/trainings/:id", element: <TrainingDetailPage /> },
      { path: "/trainings/:id/edit", element: <TrainingFormPage /> },
      { path: "/exercises", element: <ExerciseLibraryPage /> },
      { path: "/routines", element: <RoutinesPage /> },
      { path: "/routines/new", element: <RoutineFormPage /> },
      { path: "/routines/:id", element: <RoutineDetailPage /> },
      { path: "/planes", element: <IndividualPlansPage /> },
      { path: "/planes/new", element: <IndividualPlanFormPage /> },
      { path: "/planes/:id", element: <RoutineDetailPage /> },
      { path: "/planes/:id/edit", element: <IndividualPlanFormPage /> },
      {
        path: "/evaluations",
        element: (
          <ProtectedRoute allow={["dt"]}>
            <EvaluationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/evaluations/new",
        element: (
          <ProtectedRoute allow={["dt"]}>
            <EvaluationFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/evaluations/:id",
        element: (
          <ProtectedRoute allow={["dt"]}>
            <EvaluationDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/nationals",
        element: (
          <ProtectedRoute allow={["dt"]}>
            <NationalsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/nationals/new",
        element: (
          <ProtectedRoute allow={["dt"]}>
            <NationalFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/nationals/:id",
        element: (
          <ProtectedRoute allow={["dt"]}>
            <NationalDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/nationals/:id/edit",
        element: (
          <ProtectedRoute allow={["dt"]}>
            <NationalFormPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
