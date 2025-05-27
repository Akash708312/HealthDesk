
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/services/communityService";
import { MapPin, Phone, Mail, Clock, Star, User, Calendar } from "lucide-react";

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  open: boolean;
  onClose: () => void;
  onBookAppointment: () => void;
}

const DoctorProfileModal = ({ doctor, open, onClose, onBookAppointment }: DoctorProfileModalProps) => {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{doctor.full_name}</span>
            <Badge variant="outline" className="bg-primary-100 text-primary-800 ml-2">
              {doctor.specialty}
            </Badge>
          </DialogTitle>
          <DialogDescription>Volunteer Healthcare Provider</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-center justify-center">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-primary-200">
              <img
                src={doctor.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=6E59A5&color=fff`}
                alt={doctor.full_name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Experience</p>
                <p>{doctor.experience} years</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Location</p>
                <p>{doctor.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Availability</p>
                <p>{doctor.availability}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Email</p>
                <p>{doctor.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Phone</p>
                <p>{doctor.phone}</p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <p className="font-medium text-gray-700 mb-2">About</p>
            <p className="text-gray-600">{doctor.bio}</p>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-4 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onBookAppointment}>
            <Calendar className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorProfileModal;
