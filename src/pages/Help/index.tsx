import { useState } from "react";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer:
        "Browse products, add to cart, and proceed to checkout with delivery and payment details.",
      category: "Ordering",
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, bank transfers, mobile money, and cash on delivery.",
      category: "Payment",
    },
    {
      id: 3,
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 2-4 hours, express delivery takes 90 minutes.",
      category: "Delivery",
    },
    {
      id: 4,
      question: "Can I cancel my order?",
      answer:
        "You can cancel within 1 hour of placing the order. Contact customer service for assistance.",
      category: "Ordering",
    },
    {
      id: 5,
      question: "What if I'm not satisfied?",
      answer:
        "Contact us within 24 hours of delivery for resolution or refund as per our return policy.",
      category: "Returns",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions and get the help you need
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center p-6">
            <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get instant help from our support team
            </p>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Start Chat
            </Button>
          </Card>

          <Card className="text-center p-6">
            <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-sm text-gray-600 mb-3">
              Speak directly with customer service
            </p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              +234 801 234 5678
            </Button>
          </Card>

          <Card className="text-center p-6">
            <Mail className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-3">
              Send us a detailed message
            </p>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              Send Email
            </Button>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-secondary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="border rounded-lg">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{faq.category}</Badge>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-700">{faq.answer}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          Was this helpful?
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No results found. Try different search terms.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Still Need Help */}
        <Card className="mt-8 bg-gradient-to-r from-secondary to-secondary-100 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Still Need Help?</h3>
            <p className="mb-4">Our support team is here to help you 24/7</p>
            <Button
              variant="outline"
              className="bg-white text-secondary hover:bg-gray-100"
            >
              Contact Support Team
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
