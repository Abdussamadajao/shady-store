import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Check, X } from "lucide-react";
import {
  useContacts,
  useSelectedContactId,
  useCheckoutStore,
  type Contact,
} from "@/store/checkout";

const ContactNumber: React.FC = () => {
  const contacts = useContacts();
  const selectedContactId = useSelectedContactId();
  const { addContact, deleteContact, selectContact } = useCheckoutStore();

  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleAddContact = () => {
    if (!contactForm.name || !contactForm.phone || !contactForm.email) {
      alert("Please fill in all contact fields");
      return;
    }

    addContact(contactForm);
    setContactForm({
      name: "",
      phone: "",
      email: "",
    });
    setShowContactForm(false);
  };

  const handleEditContact = (contact: Contact) => {
    setContactForm({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    });
    setShowContactForm(true);
  };

  const handleDeleteContact = (id: string) => {
    deleteContact(id);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
              selectedContactId ? "bg-secondary" : "bg-gray-400"
            }`}
          >
            {selectedContactId ? <Check className="h-5 w-5" /> : "2"}
          </div>
          <CardTitle className="text-lg">Contact Number</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.length > 0 && (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedContactId === contact.id
                    ? "border-secondary bg-transparent"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => selectContact(contact.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-800">
                        {contact.name}
                      </h4>
                      {contact.isDefault && (
                        <span className="px-2 py-1 bg-secondary-100 text-secondary text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditContact(contact);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContact(contact.id);
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showContactForm ? (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Name</Label>
                <Input
                  id="contactName"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddContact}
                className="bg-secondary hover:bg-secondary-100"
              >
                Save Contact
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="text-secondary border-secondary hover:bg-secondary-100"
            onClick={() => setShowContactForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactNumber;
