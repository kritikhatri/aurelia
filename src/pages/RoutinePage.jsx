import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import useAuthStore from '../features/useAuthStore';
import { Sparkles, CalendarClock, Plus, Trash, Save, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const RoutinePage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [routineType, setRoutineType] = useState('AM');
  const [steps, setSteps] = useState([
    { stepNumber: 1, product: '', note: '' }
  ]);
  const [reminderTime, setReminderTime] = useState('08:00 AM');

  // Fetch product catalog for selection lists
  const { data: catalog } = useQuery({
    queryKey: ['catalogList'],
    queryFn: async () => {
      const res = await api.get('/products?page=1');
      return res.data.products || [];
    }
  });

  // Save routine mutation
  const saveRoutineMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/routines', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success(`${routineType} routine diaries updated!`);
      queryClient.invalidateQueries(['myRoutines']);
    },
    onError: () => {
      toast.error('Failed to save routine steps');
    }
  });

  const handleAddStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, product: '', note: '' }]);
  };

  const handleRemoveStep = (idx) => {
    const filtered = steps.filter((_, i) => i !== idx).map((step, i) => ({
      ...step,
      stepNumber: i + 1
    }));
    setSteps(filtered);
  };

  const handleStepChange = (idx, field, value) => {
    const updated = steps.map((step, i) => {
      if (i === idx) {
        return { ...step, [field]: value };
      }
      return step;
    });
    setSteps(updated);
  };

  const handleSaveRoutine = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to save your routine diary');
      return;
    }

    // Validate that at least one product is selected
    const validSteps = steps.filter(s => s.product !== '');
    if (validSteps.length === 0) {
      toast.error('Please select at least one product for your routine');
      return;
    }

    saveRoutineMutation.mutate({
      routineType,
      steps: validSteps,
      reminderTime
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8 pb-16">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-gold" /> Routine Builder
        </span>
        <h1 className="text-4xl font-serif text-plum dark:text-ivory mt-2">Virtual AM & PM Layering Diary</h1>
        <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 mt-2 font-semibold">
          Structure active skincare ingredients, sequence order, and calendar reminders
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 border border-plum/10 shadow-xl space-y-6">
        
        {/* Toggle AM/PM */}
        <div className="flex border-b border-plum/5 pb-4 text-xs font-bold uppercase tracking-wider gap-4">
          <button
            onClick={() => { setRoutineType('AM'); setReminderTime('08:00 AM'); }}
            className={`pb-2 focus:outline-none ${routineType === 'AM' ? 'border-b-2 border-gold text-gold' : 'text-plum/50 dark:text-ivory/50'}`}
          >
            Morning AM Routine
          </button>
          <button
            onClick={() => { setRoutineType('PM'); setReminderTime('09:00 PM'); }}
            className={`pb-2 focus:outline-none ${routineType === 'PM' ? 'border-b-2 border-gold text-gold' : 'text-plum/50 dark:text-ivory/50'}`}
          >
            Evening PM Routine
          </button>
        </div>

        {/* Tip */}
        <div className="flex gap-3 bg-plum/5 p-4 border border-plum/5 text-xs text-plum/70 dark:text-ivory/70 leading-relaxed font-light">
          <Info className="w-5 h-5 text-gold shrink-0" />
          <span>
            **Dermatologist Tip**: Always layer water-soluble formulas (like Niacinamide or Hyaluronic acid serums) first, followed by heavier lipids (like Copper Peptide Elixir oil), and lock in with creams.
          </span>
        </div>

        {/* Steps list form */}
        <form onSubmit={handleSaveRoutine} className="space-y-6">
          
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-end border-b border-plum/5 pb-4">
                <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs shrink-0">
                  {step.stepNumber}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Select Formula</label>
                    <select
                      value={step.product}
                      onChange={(e) => handleStepChange(idx, 'product', e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs text-plum dark:text-ivory"
                    >
                      <option value="" className="bg-ivory dark:bg-obsidian">Choose product...</option>
                      {catalog?.map((prod) => (
                        <option key={prod._id} value={prod._id} className="bg-ivory dark:bg-obsidian">
                          {prod.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Application Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Apply on damp skin"
                      value={step.note}
                      onChange={(e) => handleStepChange(idx, 'note', e.target.value)}
                      className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                    />
                  </div>
                </div>

                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-2 hover:text-red-500 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Step trigger */}
          <button
            type="button"
            onClick={handleAddStep}
            className="flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider hover:underline"
          >
            <Plus className="w-4 h-4" /> Add Sequence Step
          </button>

          {/* Reminder settings */}
          <div className="pt-4 border-t border-plum/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <CalendarClock className="w-5 h-5 text-gold" />
              <span className="uppercase font-bold tracking-wider">Reminder Time:</span>
              <input
                type="text"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                placeholder="e.g. 08:00 AM"
                className="bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs font-bold text-center outline-none w-24"
              />
            </div>

            {user ? (
              <button type="submit" className="btn-plum flex items-center gap-1.5 px-8">
                <Save className="w-4 h-4 text-gold" /> Save Routine Diary
              </button>
            ) : (
              <p className="text-xs font-light text-plum/50">
                Please <Link to="/auth?tab=login" className="underline font-bold text-gold">login</Link> to save routines.
              </p>
            )}
          </div>

        </form>

      </div>

    </div>
  );
};

export default RoutinePage;
