
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Mail, Phone, FileText } from "lucide-react";
import { toast } from "sonner";

interface VolunteerFormProps {
  initiativeId: string;
  initiativeTitle: string;
  onSuccess: () => void;
}

const volunteerFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  profession: z.string().min(2, { message: "Please enter your profession." }),
  availability: z.string().min(1, { message: "Please select your availability." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

const VolunteerForm = ({ initiativeId, initiativeTitle, onSuccess }: VolunteerFormProps) => {
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      profession: "",
      availability: "",
      message: "",
    },
  });

  const onSubmit = (data: VolunteerFormValues) => {
    // In a real app, send the data to the server
    console.log("Volunteer form data:", { initiativeId, ...data });
    
    // Show success message
    toast.success("Thank you for volunteering! We'll contact you soon.");
    
    // Reset form and call onSuccess
    form.reset();
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" placeholder="John Doe" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" placeholder="john@example.com" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" placeholder="(123) 456-7890" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession/Skills</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-10" placeholder="e.g., Nurse, Logistics, Administration" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select when you can volunteer" />
                    </SelectTrigger>
                  </div>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="evenings">Evenings Only</SelectItem>
                  <SelectItem value="mornings">Mornings Only</SelectItem>
                  <SelectItem value="flexible">Flexible Schedule</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Why would you like to volunteer for this initiative?" 
                  className="min-h-[100px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-center pt-2">
          <Button type="submit" className="px-8 py-2 bg-primary-600 hover:bg-primary-700">
            Submit Volunteer Application
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VolunteerForm;
