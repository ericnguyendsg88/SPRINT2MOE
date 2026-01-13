import { HelpCircle, Phone, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How is my education account balance calculated?',
    answer: 'Your balance is topped up through government schemes based on your age, schooling status, and account balance. These top-ups occur periodically and are subject to scheme rules and eligibility criteria.',
  },
  {
    question: 'What can I use my education account for?',
    answer: 'You can use your education account balance to pay for approved courses from registered education providers. The list of approved courses covers various categories including technology, business, design, and more.',
  },
  {
    question: 'What happens when I turn 30?',
    answer: 'Your education account will be automatically closed when you reach 30 years of age. Any remaining balance that has not been used will be forfeited. We recommend using your balance for approved courses before your account closure date.',
  },
  {
    question: 'Can I withdraw my balance as cash?',
    answer: 'No, the education account balance cannot be withdrawn as cash. It can only be used for paying course fees at approved education providers.',
  },
  {
    question: 'How do I pay for course fees?',
    answer: 'You can pay for course fees using your education account balance, credit/debit card, or PayNow. Navigate to the Course Fees section to view pending charges and make payments.',
  },
  {
    question: 'How do I update my personal information?',
    answer: 'You can update your contact details (email, phone) and addresses through the My Profile section. For changes to your name, NRIC, or date of birth, please visit a service center with valid identification documents.',
  },
];

export default function Help() {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground mt-1">Find answers and get assistance</p>
      </div>

      {/* Contact Options */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mx-auto">
            <Phone className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mt-4">Call Us</h3>
          <p className="text-sm text-muted-foreground mt-1">Mon-Fri, 8am-6pm</p>
          <p className="font-medium text-foreground mt-2">1800-123-4567</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mt-4">Email Us</h3>
          <p className="text-sm text-muted-foreground mt-1">Response within 3 days</p>
          <p className="font-medium text-foreground mt-2">support@educredit.gov.sg</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 mx-auto">
            <MessageSquare className="h-6 w-6 text-success" />
          </div>
          <h3 className="font-semibold text-foreground mt-4">Live Chat</h3>
          <p className="text-sm text-muted-foreground mt-1">Available 24/7</p>
          <Button variant="outline" size="sm" className="mt-2">
            Start Chat
          </Button>
        </div>
      </div>

      {/* FAQs */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">Common questions about your education account</p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Quick Links */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Quick Links</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <a 
            href="#" 
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
          >
            <span className="text-sm font-medium">Terms and Conditions</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
          <a 
            href="#" 
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
          >
            <span className="text-sm font-medium">Privacy Policy</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
          <a 
            href="#" 
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
          >
            <span className="text-sm font-medium">List of Approved Courses</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
          <a 
            href="#" 
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
          >
            <span className="text-sm font-medium">Scheme Eligibility</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Feedback */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">
        <h3 className="font-semibold text-foreground">Have feedback?</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We're always looking to improve. Share your feedback to help us serve you better.
        </p>
        <Button variant="accent" size="sm" className="mt-4">
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}
