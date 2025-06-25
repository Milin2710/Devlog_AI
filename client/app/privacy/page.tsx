import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Code,
  Shield,
  Lock,
  Eye,
  Database,
  Calendar,
  Cookie,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
            <Shield className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">
            Your privacy matters. Here's how we protect and handle your data.
          </p>
          <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4 mr-2" />
            Last updated: {lastUpdated}
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              Privacy Commitment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              At DEVLOG, we believe your coding journey is personal. This
              Privacy Policy explains how we collect, use, protect, and share
              your information when you use our personal coding journal service.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-900/20"
                  >
                    Account Information
                  </Badge>
                </h4>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>
                    Email address (for account creation and communication)
                  </li>
                  <li>Name (first and last name for personalization)</li>
                  <li>Profile information (optional bio, avatar)</li>
                  <li>
                    Authentication data (encrypted passwords, OAuth tokens)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 dark:bg-green-900/20"
                  >
                    Journal Content
                  </Badge>
                </h4>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>Journal entries (titles, content, tags)</li>
                  <li>Featured images and uploaded files</li>
                  <li>Entry timestamps and modification history</li>
                  <li>Search queries and activity patterns</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-orange-50 dark:bg-orange-900/20"
                  >
                    Technical Data
                  </Badge>
                </h4>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>
                    IP address and location data (for security and analytics)
                  </li>
                  <li>Device information (browser, operating system)</li>
                  <li>Usage analytics (features used, session duration)</li>
                  <li>Error logs and performance metrics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Core Service Functionality
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 ml-4">
                  <li>Store and organize your journal entries</li>
                  <li>Provide search and filtering capabilities</li>
                  <li>Generate activity calendars and progress tracking</li>
                  <li>Enable AI-powered entry summaries</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Account Management
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 ml-4">
                  <li>Authenticate and secure your account</li>
                  <li>Send important service notifications</li>
                  <li>Provide customer support</li>
                  <li>Prevent fraud and abuse</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Service Improvement
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 ml-4">
                  <li>Analyze usage patterns to improve features</li>
                  <li>Debug technical issues and optimize performance</li>
                  <li>Develop new features based on user needs</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                3. AI Processing and Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  AI Summary Feature
                </h4>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  When you use our AI summary feature, your journal content may
                  be processed by third-party AI services (such as Gemini) to
                  generate summaries. This data is processed securely and is not
                  stored by these services.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Third-Party Integrations
                </h4>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>
                    <strong>Authentication:</strong> We use secure OAuth
                    providers (Google, GitHub) for sign-in
                  </li>
                  <li>
                    <strong>File Storage:</strong> Images are stored securely
                    using cloud storage services
                  </li>
                  <li>
                    <strong>Analytics:</strong> We use privacy-focused analytics
                    to understand usage patterns
                  </li>
                  <li>
                    <strong>Email:</strong> Transactional emails are sent
                    through secure email services
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-yellow-600" />
                4. Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Essential Cookies
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We use essential cookies to maintain your login session, and
                  ensure the security of your account.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Analytics Cookies
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We use privacy-focused analytics cookies to understand how
                  users interact with DEVLOG. This helps us improve the service
                  without compromising your privacy.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Cookie Control:</strong> You can manage cookie
                  preferences in your browser settings. Note that disabling
                  essential cookies may affect service functionality.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card>
            <CardHeader>
              <CardTitle>5. Data Security and Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Security Measures
                </h4>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure password hashing and storage</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and monitoring</li>
                  <li>Secure cloud infrastructure with reputable providers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Data Backup and Recovery
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We maintain secure backups of your data to prevent loss due to
                  technical failures. Backups are encrypted and stored in
                  secure, geographically distributed locations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card>
            <CardHeader>
              <CardTitle>6. Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Our Commitment
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  We do not sell, rent, or trade your personal information to
                  third parties for marketing purposes. Your journal entries are
                  private and personal to you.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Limited Sharing Scenarios
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                  We may share your information only in these specific
                  circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a business transfer or acquisition</li>
                  <li>
                    With service providers who help us operate DEVLOG (under
                    strict confidentiality agreements)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card>
            <CardHeader>
              <CardTitle>7. Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Access and Control
                </h4>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>
                    <strong>Access:</strong> View and download all your personal
                    data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct your account
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and all associated data
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your journal entries in
                    standard formats
                  </li>
                  <li>
                    <strong>Restriction:</strong> Limit how we process your
                    information
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  How to Exercise Your Rights
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  You can exercise most of these rights directly through your
                  account settings. For other requests, contact us at
                  privacy@devlog.app with your specific request and account
                  information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card>
            <CardHeader>
              <CardTitle>8. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Active Accounts
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We retain your journal entries and account information as long
                  as your account is active and for a reasonable period
                  afterward to provide you with the service.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Account Deletion
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  When you delete your account, we will permanently delete your
                  personal information and journal entries within 30 days,
                  except where we are required to retain certain information for
                  legal or regulatory purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card>
            <CardHeader>
              <CardTitle>9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                DEVLOG is hosted on secure cloud infrastructure that may involve
                data processing in different countries. We ensure that any
                international data transfers comply with applicable privacy laws
                and are protected by appropriate safeguards.
              </p>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card>
            <CardHeader>
              <CardTitle>10. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                DEVLOG is not intended for children under 13 years of age. We do
                not knowingly collect personal information from children under
                13. If we become aware that we have collected such information,
                we will take steps to delete it promptly.
              </p>
            </CardContent>
          </Card>

          {/* Section 11 */}
          <Card>
            <CardHeader>
              <CardTitle>11. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or applicable laws. We will notify you
                of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>
                  Sending an email notification to your registered email address
                </li>
                <li>Displaying a prominent notice in the application</li>
                <li>
                  Updating the "Last updated" date at the top of this policy
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 12 */}
          <Card>
            <CardHeader>
              <CardTitle>12. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Privacy Officer:</strong> privacy@devlog.app
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>General Inquiries:</strong> support@devlog.app
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Data Protection Requests:</strong> Include "Privacy
                  Request" in the subject line
                </p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                We will respond to your privacy-related inquiries within 30
                days.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-12" />

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your privacy is fundamental to how we build and operate DEVLOG.
            Thank you for trusting us with your coding journey.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/terms">
              <Button variant="outline" size="sm">
                Terms & Conditions
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
