import { Link } from 'react-router-dom';
import { GraduationCap, Shield, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4" />
              Education Account System
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Empowering Education for{' '}
              <span className="text-accent">Every Singaporean</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive education account system for Singapore Citizens aged 16-30. 
              Access your education funds, pay course fees, and track your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link to="/eservice">
                <Button size="lg" variant="accent" className="w-full sm:w-auto">
                  <User className="h-5 w-5 mr-2" />
                  Access e-Service Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Shield className="h-5 w-5 mr-2" />
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Simple, secure, and designed for your educational success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Automatic Activation</h3>
              <p className="text-sm text-muted-foreground">
                Your education account is automatically created when you turn 16, with no action required.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4">
                <span className="text-xl font-bold text-accent">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Receive Credits</h3>
              <p className="text-sm text-muted-foreground">
                Periodic top-ups are credited to your account based on government schemes and eligibility.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 mb-4">
                <span className="text-xl font-bold text-success">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Pay Course Fees</h3>
              <p className="text-sm text-muted-foreground">
                Use your balance or other payment methods to pay for approved courses from registered providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Cards */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* e-Service Portal Card */}
            <Link to="/eservice" className="group">
              <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-card transition-smooth hover:shadow-elevated hover:border-accent/30">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-smooth">
                  <User className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mt-6">e-Service Portal</h3>
                <p className="text-muted-foreground mt-2">
                  For account holders to view balance, transactions, and pay course fees.
                </p>
                <ul className="mt-4 space-y-2">
                  {['View account balance', 'Pay course fees', 'Transaction history', 'Update profile'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 mt-6 text-accent font-medium">
                  Access Portal
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Admin Portal Card */}
            <Link to="/admin" className="group">
              <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-card transition-smooth hover:shadow-elevated hover:border-primary/30">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mt-6">Admin Portal</h3>
                <p className="text-muted-foreground mt-2">
                  For administrators to manage accounts, courses, and process fees.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Account management', 'Batch top-ups', 'Course management', 'Fee processing'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 mt-6 text-primary font-medium">
                  Access Portal
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">EduCredit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Education Account System. Government of Singapore.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
