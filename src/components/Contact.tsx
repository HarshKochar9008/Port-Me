
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useInView } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      
      setFormData({
        name: "",
        email: "",
        message: ""
      });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <section id="contact" className="bg-muted/50 dark:bg-transparent">
      <div className="section-container" ref={ref}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className={`inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4 transition-all duration-500 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            Contact
          </span>
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-500 delay-100 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            Get in Touch
          </h2>
          
          <p className={`text-muted-foreground transition-all duration-500 delay-200 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            Have a project in mind or want to discuss potential opportunities? Feel free to reach out.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className={`transition-all duration-700 ${
            isInView 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-10'
          }`}>
            <div className="glass-card rounded-xl p-6 md:p-8 h-full">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a href="harshkocahr88@gmail.com" className="text-foreground hover:text-primary transition-colors">
                    harshkocahr88@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <a href="tel:+1234567890" className="text-foreground hover:text-primary transition-colors">
                      +91 7030649008
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-foreground">Banglore, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`transition-all duration-700 ${
            isInView 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-10'
          }`}>
            <div className="glass-card rounded-xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    required
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    required
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[120px]"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-md"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
