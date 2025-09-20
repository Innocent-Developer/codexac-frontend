import { useState, useEffect } from "react";
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  ShieldCheck,
} from "lucide-react";
import Modal from "../components/model";

const KycPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    idNumber: "",
    idType: "passport",
  });

  const [idDocument, setIdDocument] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Add preview state for uploaded files
  const [previews, setPreviews] = useState({
    idDocument: null,
    livePhoto: null,
  });

  // Add new state for upload loading
  const [uploadLoading, setUploadLoading] = useState({
    idDocument: false,
    livePhoto: false,
  });

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const uid = user?.user?.uid;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update the handleFileUpload function
  const handleFileUpload = async (file, type) => {
    try {
      setUploadLoading((prev) => ({ ...prev, [type]: true }));
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://api.chuchuparty.online/upload/file",
        {
          method: "POST",
          body: formData,
        }
      );

      // Check if response is OK and contains valid JSON
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response data
      if (!data.success || !data.fileUrl) {
        console.error("Invalid upload response:", data);
        throw new Error("Invalid response from upload server");
      }

      return data.fileUrl;
    } catch (error) {
      console.error(`Upload error for ${type}:`, error);
      throw new Error(`Failed to upload ${type}. Please try again.`);
    } finally {
      setUploadLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Update file handling function
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({
        ...prev,
        [type]: previewUrl,
      }));

      // Set file state
      if (type === "idDocument") {
        setIdDocument(file);
      } else {
        setLivePhoto(file);
      }
    }
  };

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      // Revoke preview URLs to avoid memory leaks
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !formData.fullName ||
        !formData.dateOfBirth ||
        !formData.address ||
        !formData.idNumber ||
        !formData.idType ||
        !idDocument
      ) {
        throw new Error("All required fields must be provided");
      }

      // Upload files first
      const idDocumentUrl = await handleFileUpload(idDocument, "ID Document");
      const livePhotoUrl = livePhoto
        ? await handleFileUpload(livePhoto, "Live Photo")
        : null;

      // Submit KYC application
      const response = await fetch(
        "https://api.funchatparty.online/api/kyc-apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            userId: uid,
            ...formData,
            idDocumentUrl,
            livePhotoUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 400 &&
          data.message === "KYC application already exists"
        ) {
          throw new Error("You have already submitted a KYC application");
        }
        throw new Error(data.message || "KYC application failed");
      }

      setSuccess(true);
      setShowSuccessModal(true);
      // Clear form after success
      setFormData({
        fullName: "",
        dateOfBirth: "",
        address: "",
        idNumber: "",
        idType: "passport",
      });
      setIdDocument(null);
      setLivePhoto(null);
      setPreviews({ idDocument: null, livePhoto: null });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Welcome Modal */}
      <Modal isOpen={showStartModal} onClose={() => setShowStartModal(false)}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck size={48} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Welcome to KYC Verification
          </h2>
          <p className="text-gray-400 mb-6">
            To enhance your account security and comply with regulations, we
            need to verify your identity. Please prepare the following:
          </p>
          <ul className="text-left text-gray-400 space-y-2 mb-6">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Valid government-issued ID
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Clear photo of your ID document
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Proof of address (if required)
            </li>
          </ul>
          <button
            onClick={() => setShowStartModal(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-all"
          >
            Get Started
          </button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            KYC Application Submitted!
          </h2>
          <p className="text-gray-400 mb-6">
            Your KYC application has been successfully submitted. Our team will
            review your documents and update your verification status within
            24-48 hours.
          </p>
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="text-left text-gray-400 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                We'll review your submitted documents
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                You'll receive an email notification
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Your account will be updated automatically
              </li>
            </ul>
          </div>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              window.location.href = "/";
            }}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </Modal>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">KYC Verification</h1>
          <p className="text-gray-400">Complete your identity verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800/50 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800/50 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800/50 rounded-lg"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* ID Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">ID Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  ID Type
                </label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800/50 rounded-lg"
                >
                  <option value="passport">Passport</option>
                  <option value="driving_license">Driving License</option>
                  <option value="national_id">National ID</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  ID Number
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800/50 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* ID Document Upload */}
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-xl p-4">
                  <label className="block text-sm text-gray-400 mb-3 flex items-center justify-between">
                    <span>
                      ID Document <span className="text-red-400">*</span>
                    </span>
                    {uploadLoading.idDocument && (
                      <Loader2 className="animate-spin" size={16} />
                    )}
                  </label>

                  <div className="relative group">
                    {previews.idDocument ? (
                      <div className="relative">
                        <img
                          src={previews.idDocument}
                          alt="ID Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setIdDocument(null);
                              setPreviews((prev) => ({
                                ...prev,
                                idDocument: null,
                              }));
                            }}
                            className="p-2 bg-red-500/80 rounded-full hover:bg-red-600/80 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "idDocument")}
                          required
                          accept="image/*"
                          className="hidden"
                          id="idDocument"
                        />
                        <label
                          htmlFor="idDocument"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-400">
                            Click to upload ID document
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Supported: JPG, PNG (Max 5MB)
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Photo Upload */}
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-xl p-4">
                  <label className="block text-sm text-gray-400 mb-3 flex items-center justify-between">
                    <span>Live Photo (Optional)</span>
                    {uploadLoading.livePhoto && (
                      <Loader2 className="animate-spin" size={16} />
                    )}
                  </label>

                  <div className="relative group">
                    {previews.livePhoto ? (
                      <div className="relative">
                        <img
                          src={previews.livePhoto}
                          alt="Photo Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setLivePhoto(null);
                              setPreviews((prev) => ({
                                ...prev,
                                livePhoto: null,
                              }));
                            }}
                            className="p-2 bg-red-500/80 rounded-full hover:bg-red-600/80 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "livePhoto")}
                          accept="image/*"
                          className="hidden"
                          id="livePhoto"
                        />
                        <label
                          htmlFor="livePhoto"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-400">
                            Click to upload live photo
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Supported: JPG, PNG (Max 5MB)
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              "Submit KYC Application"
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Success Message */}
          {/* show in popup style  */}
          {success && (
            <div className="bg-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-2">
              <CheckCircle size={20} />
              KYC application submitted successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default KycPage;
