import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Code, Shield, FileText, Calendar } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const lastUpdated = "June 2, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img className="h-9 w-9" src="/favicon.ico" alt="" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              DEVLOG
            </span>
          </Link>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">
            Please read these terms carefully before using DEVLOG
          </p>
          <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4 mr-2" />
            Last updated: {lastUpdated}
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Agreement Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              By accessing and using DEVLOG ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement. If
              you do not agree to abide by the above, please do not use this
              service.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                By creating an account or using DEVLOG, you acknowledge that you
                have read, understood, and agree to be bound by these Terms &
                Conditions and our Privacy Policy.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the service constitutes acceptance of any modifications.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                DEVLOG is a personal coding journal application that allows
                users to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>
                  Create, edit, and manage journal entries about their coding
                  journey
                </li>
                <li>Organize entries with tags and search functionality</li>
                <li>
                  Track learning progress with calendar views and analytics
                </li>
                <li>Generate AI-powered summaries of their entries</li>
                <li>Upload and manage featured images for entries</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The service is provided "as is" and we make no warranties
                regarding availability, functionality, or data integrity.
              </p>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Account Creation
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  You must provide accurate and complete information when
                  creating your account. You are responsible for maintaining the
                  confidentiality of your account credentials.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  User Conduct
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 ml-4 mt-2">
                  <li>
                    Use the service for any illegal or unauthorized purpose
                  </li>
                  <li>Upload malicious content, viruses, or harmful code</li>
                  <li>
                    Attempt to gain unauthorized access to other users' accounts
                  </li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>
                    Use automated tools to access the service without permission
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card>
            <CardHeader>
              <CardTitle>4. Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Your Content
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  You retain ownership of all content you create and upload to
                  DEVLOG, including journal entries, images, and other
                  materials. By using our service, you grant us a limited
                  license to store, process, and display your content solely for
                  the purpose of providing the service.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Our Content
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  The DEVLOG platform, including its design, features, and
                  underlying technology, is owned by us and protected by
                  intellectual property laws. You may not copy, modify, or
                  distribute our platform without explicit permission.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card>
            <CardHeader>
              <CardTitle>5. AI Features and Data Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                DEVLOG includes AI-powered features such as entry summarization.
                By using these features, you acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>
                  Your content may be processed by third-party AI services
                </li>
                <li>
                  AI-generated summaries are for informational purposes only
                </li>
                <li>
                  We do not guarantee the accuracy of AI-generated content
                </li>
                <li>You should review AI outputs before relying on them</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card>
            <CardHeader>
              <CardTitle>6. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Your privacy is important to us. Our collection, use, and
                protection of your personal information is governed by our{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-500 underline"
                >
                  Privacy Policy
                </Link>
                , which is incorporated into these terms by reference.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We implement appropriate security measures to protect your data,
                but cannot guarantee absolute security of information
                transmitted over the internet.
              </p>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card>
            <CardHeader>
              <CardTitle>7. Service Availability and Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We strive to maintain service availability but do not guarantee
                uninterrupted access. We may:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Temporarily suspend service for maintenance or updates</li>
                <li>Modify or discontinue features with reasonable notice</li>
                <li>
                  Implement usage limits to ensure fair access for all users
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                To the maximum extent permitted by law, DEVLOG and its creators
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including but not limited
                to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Loss of data or content</li>
                <li>Loss of profits or business opportunities</li>
                <li>Service interruptions or downtime</li>
                <li>Errors in AI-generated content</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card>
            <CardHeader>
              <CardTitle>9. Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  By You
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  You may terminate your account at any time by contacting us or
                  using account deletion features within the application.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  By Us
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We may suspend or terminate accounts that violate these terms,
                  engage in abusive behavior, or for other legitimate business
                  reasons.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card>
            <CardHeader>
              <CardTitle>10. Governing Law and Disputes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                These terms shall be governed by and construed in accordance
                with applicable laws. Any disputes arising from these terms or
                your use of DEVLOG should first be addressed through good faith
                negotiation.
              </p>
            </CardContent>
          </Card>

          {/* Section 11 */}
          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have questions about these Terms & Conditions, please
                contact us at:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Email:</strong> legal@devlog.app
                  <br />
                  <strong>Subject:</strong> Terms & Conditions Inquiry
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-12" />

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            By using DEVLOG, you acknowledge that you have read and understood
            these Terms & Conditions.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/privacy">
              <Button variant="outline" size="sm">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
