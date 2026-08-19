-- C15 Manager — borra todos los datos demo cargados por seed_demo.sql
-- No afecta datos reales cargados después, porque los demo usan siempre
-- IDs dentro de estos rangos fijos (prefijos por tabla). Orden: hijos antes
-- que padres.

delete from becados
  where id between '14000000-0000-0000-0000-000000000000' and '14000000-0000-0000-0000-ffffffffffff';

delete from player_report_notes
  where id between '18000000-0000-0000-0000-000000000000' and '18000000-0000-0000-0000-ffffffffffff';

delete from match_cards
  where id between '19000000-0000-0000-0000-000000000000' and '19000000-0000-0000-0000-ffffffffffff';

delete from match_injury_notes
  where id between '1b000000-0000-0000-0000-000000000000' and '1b000000-0000-0000-0000-ffffffffffff';

delete from match_goals
  where id between '1c000000-0000-0000-0000-000000000000' and '1c000000-0000-0000-0000-ffffffffffff';

delete from routine_exercise_weeks
  where id between '17000000-0000-0000-0000-000000000000' and '17000000-0000-0000-0000-ffffffffffff';

delete from physical_test_reps
  where id between '13100000-0000-0000-0000-000000000000' and '13100000-0000-0000-0000-ffffffffffff';

delete from physical_tests
  where id between '13000000-0000-0000-0000-000000000000' and '13000000-0000-0000-0000-ffffffffffff';

delete from match_substitutions
  where id between '12000000-0000-0000-0000-000000000000' and '12000000-0000-0000-0000-ffffffffffff';

delete from national_payments
  where id between '1f000000-0000-0000-0000-000000000000' and '1f000000-0000-0000-0000-ffffffffffff';

delete from national_player_costs
  where id between '11000000-0000-0000-0000-000000000000' and '11000000-0000-0000-0000-ffffffffffff';

delete from national_expenses
  where id between 'f0000000-0000-0000-0000-000000000000' and 'f0000000-0000-0000-0000-ffffffffffff';

delete from national_activities
  where id between 'e0000000-0000-0000-0000-000000000000' and 'e0000000-0000-0000-0000-ffffffffffff';

delete from matches
  where id between 'c0000000-0000-0000-0000-000000000000' and 'c0000000-0000-0000-0000-ffffffffffff';

delete from nationals
  where id between 'd0000000-0000-0000-0000-000000000000' and 'd0000000-0000-0000-0000-ffffffffffff';

delete from tournaments
  where id between '1a000000-0000-0000-0000-000000000000' and '1a000000-0000-0000-0000-ffffffffffff';

delete from routine_assignment_players
  where routine_assignment_id between 'a0000000-0000-0000-0000-000000000000' and 'a0000000-0000-0000-0000-ffffffffffff';

delete from routine_assignments
  where id between 'a0000000-0000-0000-0000-000000000000' and 'a0000000-0000-0000-0000-ffffffffffff';

delete from routine_exercises
  where id between '90000000-0000-0000-0000-000000000000' and '90000000-0000-0000-0000-ffffffffffff';

delete from routine_circuits
  where id between '1e000000-0000-0000-0000-000000000000' and '1e000000-0000-0000-0000-ffffffffffff';

delete from routine_groups
  where id between '1d000000-0000-0000-0000-000000000000' and '1d000000-0000-0000-0000-ffffffffffff';

delete from routines
  where id between '80000000-0000-0000-0000-000000000000' and '80000000-0000-0000-0000-ffffffffffff';

delete from physical_exercises
  where id between '70000000-0000-0000-0000-000000000000' and '70000000-0000-0000-0000-ffffffffffff';

delete from training_player_notes
  where id between '60000000-0000-0000-0000-000000000000' and '60000000-0000-0000-0000-ffffffffffff';

delete from session_exercises
  where id between '40000000-0000-0000-0000-000000000000' and '40000000-0000-0000-0000-ffffffffffff';

delete from player_evaluations
  where id between '50000000-0000-0000-0000-000000000000' and '50000000-0000-0000-0000-ffffffffffff';

delete from training_sessions
  where id between '30000000-0000-0000-0000-000000000000' and '30000000-0000-0000-0000-ffffffffffff';

delete from training_exercises
  where id between '20000000-0000-0000-0000-000000000000' and '20000000-0000-0000-0000-ffffffffffff';

delete from players
  where id between '10000000-0000-0000-0000-000000000000' and '10000000-0000-0000-0000-ffffffffffff';
