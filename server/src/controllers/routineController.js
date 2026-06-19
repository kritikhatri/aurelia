import RoutineEntry from '../models/RoutineEntry.js';

// Get Routines
export const getMyRoutines = async (req, res) => {
  try {
    const routines = await RoutineEntry.find({ user: req.user._id }).populate('steps.product');
    return res.json(routines);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving routines', error: error.message });
  }
};

// Create or Update Routine
export const updateRoutine = async (req, res) => {
  const { routineType, steps, reminderTime } = req.body;

  try {
    let routine = await RoutineEntry.findOne({ user: req.user._id, routineType });

    if (routine) {
      // Update
      routine.steps = steps;
      routine.reminderTime = reminderTime !== undefined ? reminderTime : routine.reminderTime;
      await routine.save();
    } else {
      // Create
      routine = await RoutineEntry.create({
        user: req.user._id,
        routineType,
        steps,
        reminderTime: reminderTime || ''
      });
    }

    const populatedRoutine = await RoutineEntry.findById(routine._id).populate('steps.product');
    return res.json(populatedRoutine);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating routine', error: error.message });
  }
};
