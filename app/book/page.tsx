"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { createBooking, getAvailableDates } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  guests: string;
  message: string;
}

export default function BookPage() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [month, setMonth] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const y = month.getFullYear();
    const m = month.getMonth() + 1;
    getAvailableDates(m, y)
      .then((dates) => setDisabledDates(dates))
      .catch(() => setDisabledDates([]));
  }, [month]);

  const disabled = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [{ before: today }, ...disabledDates];
  }, [disabledDates]);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("Please sign in to make a booking.");
      return;
    }

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        name: values.name,
        email: values.email,
        phone: values.phone || "",
        event_type: values.event_type || "",
        event_date: format(selectedDate, "yyyy-MM-dd"),
        guests: parseInt(values.guests || "0", 10) || 0,
        message: values.message,
      });
      setSuccess("Booking submitted! We will contact you soon.");
      reset();
      setSelectedDate(undefined);
    } catch (e: any) {
      setError(e?.message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12"
        >
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Book Your Event</h1>
            <p className="text-neutral-600 mb-8">Choose an available date and share your event details.</p>

            {!user && (
              <div className="mb-6 p-4 rounded-lg border-2 border-primary bg-primary/10">
                <p className="text-neutral-800 mb-3">Please sign in to make a booking.</p>
                <div className="flex gap-3">
                  <Link href="/login?returnTo=/book" className="btn-primary flex-1 text-center">
                    Sign In
                  </Link>
                  <Link href="/signup?returnTo=/book" className="btn-secondary flex-1 text-center">
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-white shadow-xl border border-primary/10 p-6">
              <DayPicker
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disabled as any}
                showOutsideDays
                fixedWeeks
                weekStartsOn={1}
              />
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl border border-primary/10 p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="booking-name" className="block text-sm font-medium text-neutral-700 mb-2">Name *</label>
                  <input
                    {...register("name", { required: true })}
                    id="booking-name"
                    className="input-field"
                    placeholder="Your name"
                  />
                  {errors.name && <span className="text-red-500 text-sm">Required</span>}
                </div>
                <div>
                  <label htmlFor="booking-email" className="block text-sm font-medium text-neutral-700 mb-2">Email *</label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    id="booking-email"
                    className="input-field"
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="text-red-500 text-sm">Required</span>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="booking-phone" className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
                  <input {...register("phone")} id="booking-phone" className="input-field" placeholder="+386 ..." />
                </div>
                <div>
                  <label htmlFor="booking-event-type" className="block text-sm font-medium text-neutral-700 mb-2">Event Type</label>
                  <select {...register("event_type")} id="booking-event-type" className="input-field">
                    <option value="">Select...</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="workshop">Workshop</option>
                    <option value="private">Private Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="booking-event-date" className="block text-sm font-medium text-neutral-700 mb-2">Event Date *</label>
                  <input
                    readOnly
                    value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                    id="booking-event-date"
                    className="input-field"
                    placeholder="Pick a date on the calendar"
                  />
                </div>
                <div>
                  <label htmlFor="booking-guests" className="block text-sm font-medium text-neutral-700 mb-2">Guests</label>
                  <input type="number" {...register("guests")} id="booking-guests" className="input-field" placeholder="50" />
                </div>
              </div>
              <div>
                <label htmlFor="booking-message" className="block text-sm font-medium text-neutral-700 mb-2">Message *</label>
                <textarea {...register("message", { required: true })} id="booking-message" rows={6} className="input-field" />
                {errors.message && <span className="text-red-500 text-sm">Required</span>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center"
              >
                {submitting ? "Submitting..." : "Submit Booking"}
              </button>

              {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">{success}</div>}
              {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
