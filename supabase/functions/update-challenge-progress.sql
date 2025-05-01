
-- Create function to update challenge progress
CREATE OR REPLACE FUNCTION update_challenge_progress(p_challenge_id uuid, p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_total_contribution numeric;
BEGIN
  -- Calculate the sum of all contributions for this user in this challenge
  SELECT COALESCE(SUM(contribution_value), 0)
  INTO v_total_contribution
  FROM public.challenge_workouts
  WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
  
  -- Update the participant's progress
  UPDATE public.challenge_participants
  SET progress = v_total_contribution
  WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
  
  -- Check if any participant has reached the goal
  DECLARE
    v_goal_value numeric;
    v_challenge_status text;
    v_participant_id uuid;
    v_reached_goal boolean := false;
  BEGIN
    -- Get the challenge goal value
    SELECT goal_value, status
    INTO v_goal_value, v_challenge_status
    FROM public.challenges
    WHERE id = p_challenge_id;
    
    -- Check if this participant reached the goal
    IF v_total_contribution >= v_goal_value AND v_challenge_status = 'active' THEN
      -- Get the participant ID
      SELECT id
      INTO v_participant_id
      FROM public.challenge_participants
      WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
      
      -- Mark the challenge as completed and set winner
      UPDATE public.challenges
      SET status = 'completed', winner_id = p_user_id, end_date = now()
      WHERE id = p_challenge_id;
    END IF;
  END;
END;
$$ LANGUAGE plpgsql;
