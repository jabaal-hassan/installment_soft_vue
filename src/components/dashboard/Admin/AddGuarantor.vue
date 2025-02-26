<template>
  <div class="container-fluid d-flex align-items-center justify-content-center bg-white my-4">
    <div class="row w-75 shadow-lg">
      <div class="col-md-12 bg-white p-5">
        <!-- Change header text -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="fs-3 fw-bold m-0">Add Guarantor</h1>
        </div>

        <!-- Success and Error Popup Components -->
        <SuccessPopup :show="showSuccess" :message="successMessage" />
        <ErrorPopup :show="showError" :message="errorMessage" />

        <!-- Validation Errors -->
        <div
          v-if="validationErrors && Object.keys(validationErrors).length > 0"
          class="validation-errors-container"
        >
          <div
            v-for="(errors, field) in validationErrors"
            :key="field"
            class="validation-error-item"
          >
            <div v-for="(error, index) in errors" :key="index" class="validation-error-message">
              <i class="fas fa-exclamation-circle"></i>
              <span class="field-name">{{ field.replace('_', ' ') }}:</span>
              {{ error }}
            </div>
          </div>
        </div>

        <!-- Guarantor Add Form -->
        <form @submit.prevent="submitForm">
          <!-- File Uploads - Only CNIC front and back -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48" :class="getInputClass('cnic_front_image')">
              <div v-if="formData.cnic_front_image" class="image-preview-container">
                <img
                  :src="getImagePreviewUrl(formData.cnic_front_image)"
                  class="preview-image"
                  alt="CNIC Front"
                  @click="openImagePreview('cnic_front_image')"
                />
                <button @click="removeImage('cnic_front_image')" class="remove-image-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-else class="d-flex btn-group-custom">
                <button
                  @click="openCameraModal('cnic_front_image')"
                  class="btn btn-primary custom-btn"
                >
                  <i class="fas fa-camera me-2"></i>Capture
                </button>
                <div class="file-input-container">
                  <input
                    type="file"
                    id="cnic_front_image"
                    @change="handleFileUpload('cnic_front_image', $event)"
                    class="form-control border-0 d-none"
                    accept="image/*"
                  />
                  <label for="cnic_front_image" class="btn btn-secondary custom-btn">
                    <i class="fas fa-file-upload me-2"></i>Choose
                  </label>
                </div>
              </div>
              <label for="cnic_front_image" class="form-label notwrok">CNIC Front Image</label>
            </div>
            <div class="inputs position-relative w-48" :class="getInputClass('cnic_back_image')">
              <div v-if="formData.cnic_back_image" class="image-preview-container">
                <img
                  :src="getImagePreviewUrl(formData.cnic_back_image)"
                  class="preview-image"
                  alt="CNIC Back"
                  @click="openImagePreview('cnic_back_image')"
                />
                <button @click="removeImage('cnic_back_image')" class="remove-image-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-else class="d-flex btn-group-custom">
                <button
                  @click="openCameraModal('cnic_back_image')"
                  class="btn btn-primary custom-btn"
                >
                  <i class="fas fa-camera me-2"></i>Capture
                </button>
                <div class="file-input-container">
                  <input
                    type="file"
                    id="cnic_back_image"
                    @change="handleFileUpload('cnic_back_image', $event)"
                    class="form-control border-0 d-none"
                    accept="image/*"
                  />
                  <label for="cnic_back_image" class="btn btn-secondary custom-btn">
                    <i class="fas fa-file-upload me-2"></i>Choose
                  </label>
                </div>
              </div>
              <label for="cnic_back_image" class="form-label notwrok">CNIC Back Image</label>
            </div>
          </div>

          <!-- Name and Father Name -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="form-control border-0"
                required
                placeholder=" "
                :class="{ error: validationErrors.name }"
              />
              <label for="name" class="form-label">Full Name</label>
              <span v-if="validationErrors.name" class="error-message">
                {{ validationErrors.name[0] }}
              </span>
            </div>
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="father_name"
                v-model="formData.father_name"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="father_name" class="form-label">Father Name</label>
              <span v-if="validationErrors.father_name" class="text-danger">{{
                validationErrors.father_name[0]
              }}</span>
            </div>
          </div>

          <!-- Phone Number and CNIC -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="cnic"
                v-model="formData.cnic"
                class="form-control border-0"
                required
                placeholder=" "
                :class="{ 'error-border': validationErrors.cnic }"
              />
              <label for="cnic" class="form-label">CNIC</label>
            </div>
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="phone_number"
                v-model="formData.phone_number"
                class="form-control border-0"
                required
                placeholder=" "
                :class="{ 'error-border': validationErrors.phone_number }"
              />
              <label for="phone_number" class="form-label">Phone Number</label>
            </div>
          </div>

          <!-- Add Relationship field -->
          <div class="mb-3 inputs position-relative">
            <input
              type="text"
              id="relationship"
              v-model="formData.relationship"
              class="form-control border-0"
              required
              placeholder=" "
            />
            <label for="relationship" class="form-label">Relationship with Customer</label>
          </div>

          <!-- Address with Location Button -->
          <div class="mb-3 inputs position-relative">
            <div class="d-flex align-items-start gap-2">
              <div class="flex-grow-1">
                <textarea
                  id="address"
                  v-model="formData.address"
                  class="form-control border-0"
                  required
                  placeholder=" "
                ></textarea>
                <label for="address" class="form-label">Address</label>
              </div>
              <button
                type="button"
                class="btn btn-outline-primary location-btn"
                @click="getCurrentLocation"
                :disabled="isLoadingLocation"
              >
                <i
                  :class="isLoadingLocation ? 'fas fa-spinner fa-spin' : 'fas fa-map-marker-alt'"
                ></i>
                {{ isLoadingLocation ? 'Getting Location...' : 'Get Location' }}
              </button>
            </div>
          </div>

          <!-- Employment Type and Company Name -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <select
                id="employment_type"
                v-model="formData.employment_type"
                class="form-control border-0"
                required
                placeholder=" "
              >
                <option value="" disabled selected>Select Employment Type</option>
                <option value="Own Business">Own Business</option>
                <option value="Company Employee">Company Employee</option>
              </select>
              <label for="employment_type" class="form-label">Employment Type</label>
            </div>
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="company_name"
                v-model="formData.company_name"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="company_name" class="form-label">
                {{ formData.employment_type === 'Own Business' ? 'Business Name' : 'Company Name' }}
              </label>
            </div>
          </div>
          <div class="mb-3 inputs position-relative">
            <div class="d-flex align-items-start gap-2">
              <div class="flex-grow-1">
                <textarea
                  id="office_address"
                  v-model="formData.office_address"
                  class="form-control border-0"
                  required
                  placeholder=" "
                ></textarea>
                <label for="office_address" class="form-label">Office Address</label>
              </div>
              <button
                type="button"
                class="btn btn-outline-primary location-btn"
                @click="getCurrentOfficeLocation"
                :disabled="isLoadingLocation"
              >
                <i
                  :class="isLoadingLocation ? 'fas fa-spinner fa-spin' : 'fas fa-map-marker-alt'"
                ></i>
                {{ isLoadingLocation ? 'Getting Location...' : 'Get Location' }}
              </button>
            </div>
          </div>
          <!-- Years of Experience -->
          <div class="mb-3 inputs position-relative">
            <input
              type="number"
              id="years_of_experience"
              v-model="formData.years_of_experience"
              class="form-control border-0"
              required
              placeholder=" "
            />
            <label for="years_of_experience" class="form-label">Years of Experience</label>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn signup-btn w-100 fw-bold" :disabled="loading">
            <span v-if="loading" class="loading-content">
              <i class="fa fa-spinner fa-spin me-2"></i> Submitting...
            </span>
            <span v-else class="button-content">
              Add Guarantor
              <i class="fas fa-arrow-right ms-2"></i>
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Scanner Modal -->
  <div class="modal fade" id="scannerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              currentImageType
                ? `Capture ${currentImageType.replace('_', ' ').toUpperCase()}`
                : 'Capture Image'
            }}
          </h5>
          <button type="button" class="btn-close" @click="stopScanner"></button>
        </div>
        <div class="modal-body p-0">
          <div class="camera-container">
            <video ref="videoElement" autoplay playsinline class="camera-video"></video>
            <div
              v-if="showCardGuide"
              class="card-guide"
              :class="{
                'passport-guide': currentImageType === 'customer_image',
                'check-guide': currentImageType === 'check_image',
              }"
            >
              <div class="corner-tl"></div>
              <div class="corner-tr"></div>
              <div class="corner-bl"></div>
              <div class="corner-br"></div>
            </div>
            <div class="guide-text">
              {{ getGuideText }}
            </div>
            <button @click="captureImage" class="capture-btn">
              <i class="fas fa-camera"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Full Image Preview Modal -->
  <div class="modal fade" id="imagePreviewModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Image Preview</h5>
          <button type="button" class="btn-close" @click="closeImagePreview"></button>
        </div>
        <div class="modal-body p-0">
          <div class="full-image-container">
            <img :src="selectedImageUrl" class="full-preview-image" alt="Full Preview" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.w-48 {
  width: 49%;
}

.container-fluid {
  background-color: #f9f9f9;
}

.inputs {
  position: relative;
  border: 1px solid black;
  height: 10vh;
  padding-top: 1.5rem;
  padding-bottom: 0.5rem;
}
.error-border {
  border-color: red !important;
}
.inputs.error-border,
.inputs:has(input.error-border),
.inputs:has(select.error-border) {
  border: 1px solid red;
}

.form-label {
  position: absolute;
  top: 1.3rem;
  left: 0.75rem;
  font-size: 14px;
  color: #000000;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

input:focus + .form-label,
input:not(:placeholder-shown) + .form-label,
textarea:focus + .form-label,
textarea:not(:placeholder-shown) + .form-label,
select:focus + .form-label,
select:not(:placeholder-shown) + .form-label {
  top: -0rem;
  left: 0.75rem;
  font-size: 0.75rem;
  margin-bottom: 0%;
}

.notwrok {
  top: -0rem;
  left: 0.75rem;
  font-size: 0.75rem;
  margin-bottom: 0%;
}

input {
  background-color: transparent;
  outline: none;
  box-shadow: none;
  height: 4vh;
}

input:focus,
textarea:focus,
select:focus {
  border: none;
  box-shadow: none;
}

input,
textarea,
select {
  background-color: transparent;
  outline: none;
  box-shadow: none;
}

.form-check-input {
  height: 20px;
  width: 20px;
  border-color: #000000;
}
.form-check-input:checked {
  background-color: black;
  border-color: black;
}

.form-check-input {
  accent-color: black;
}
select {
  background-color: transparent;
  outline: none;
  box-shadow: none;
  border: 1px solid black; /* Optional: Keeps a thin border for the select */
  width: 80%; /* Ensures the select takes up the full width */
  color: #000000;
}

select option:first-child {
  color: #757575;
}

select option {
  color: #000000;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container-fluid {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
  }

  .row {
    flex-direction: column;
    align-items: center;
    width: 100% !important;
  }

  .col-md-7 {
    display: none;
  }

  .col-md-12 {
    width: 100%;
    padding: 20px;
    text-align: center;
  }

  /* Stack inputs vertically and make them full width when the screen is smaller */
  .inputs {
    width: 100% !important; /* Ensure input fields take full width */
    margin-bottom: 10px; /* Add some space between inputs */
  }

  .d-flex {
    flex-direction: column;
    width: 100%;
  }

  .w-48 {
    width: 100% !important; /* Stack the inputs vertically and take full width */
    margin-bottom: 10px; /* Add some space between inputs */
  }

  .form-label {
    font-size: 14px; /* Adjust font size for better readability on small screens */
  }
}

.form-group {
  margin-bottom: 1rem;
}

.error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.07rem;
  display: block;
}

.validation-errors-container {
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-error-item {
  margin-bottom: 8px;
}

.validation-error-item:last-child {
  margin-bottom: 0;
}

.validation-error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: #ffebee;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.validation-error-message:hover {
  transform: translateX(5px);
}

.validation-error-message i {
  color: #d32f2f;
}

.field-name {
  font-weight: 600;
  text-transform: capitalize;
}

/* Add this if you want to show company logo next to name */
.company-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.company-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

#reader {
  width: 100%;
  min-height: 300px;
}

#reader video {
  width: 100%;
  height: auto;
}

.image-preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-image-btn:hover {
  background: rgba(255, 0, 0, 0.9);
}

.camera-container {
  position: relative;
  width: 100%;
  height: 60vh;
  background: #000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-guide {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85.6mm; /* Standard ID card width */
  height: 54mm; /* Standard ID card height */
  border: 2px solid rgba(0, 255, 0, 0.7);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
}

/* Corner indicators */
.corner-tl,
.corner-tr,
.corner-bl,
.corner-br {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #00ff00;
}

.corner-tl {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

.guide-text {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
}

.gap-2 {
  gap: 0.5rem;
}

.file-input-container {
  position: relative;
}

.file-input-container label {
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px; /* Match button height */
}

.flex-grow-1 {
  flex: 1;
}

/* Add these styles for processing indicator */
.processing-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

/* Add these new styles for responsive buttons */
@media (max-width: 780px) {
  .d-flex.gap-2 {
    flex-direction: row !important; /* Keep buttons side by side */
  }

  .btn i {
    font-size: 12px;
    margin-right: 4px !important;
  }

  .file-input-container label {
    height: 32px;
    font-size: 12px;
  }
}

/* Add styles for very small screens */
@media (max-width: 360px) {
  .btn-primary,
  .btn-secondary {
    font-size: 11px;
    padding: 4px 6px;
  }

  .btn i {
    margin-right: 2px !important;
  }

  .inputs {
    height: auto;
    min-height: 10vh;
  }
}

.d-flex.gap-2 {
  flex-wrap: nowrap; /* Prevent buttons from wrapping */
}

/* Update button styles to be more futuristic */
.btn-primary,
.btn-secondary {
  position: relative;
  border: none;
  background: linear-gradient(135deg, #8710d8, #7209b7);
  color: white;
  font-weight: 500;
  letter-spacing: 0.5px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(135, 16, 216, 0.2);
  text-transform: uppercase;
  font-size: 13px;
  height: 40px;
  min-width: 100px;
}

.btn-primary::before,
.btn-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.btn-primary:hover::before,
.btn-secondary:hover::before {
  left: 100%;
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(135, 16, 216, 0.3);
  background: linear-gradient(135deg, #7209b7, #5b0894);
}

.btn-secondary {
  background: linear-gradient(135deg, #4a4a4a, #2d2d2d);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #2d2d2d, #1a1a1a);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn i {
  margin-right: 8px;
  font-size: 14px;
  transition: transform 0.3s ease;
}

.btn:hover i {
  transform: scale(1.1);
}

/* Update responsive styles for buttons */
@media (max-width: 780px) {
  .btn-primary,
  .btn-secondary {
    font-size: 11px;
    height: 36px;
    min-width: 90px;
    letter-spacing: 0.3px;
  }

  .btn i {
    font-size: 12px;
    margin-right: 4px;
  }
}

/* Update capture button style */
.capture-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 12px 30px;
  font-size: 16px;
  background: linear-gradient(135deg, #00ff00, #00cc00);
  color: #000;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
  transition: all 0.3s ease;
}

.capture-btn:hover {
  background: linear-gradient(135deg, #00cc00, #009900);
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 255, 0, 0.4);
}

/* Add shine effect to all buttons */
@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.btn:active {
  transform: scale(0.98);
}

/* Update signup button styles */
.signup-btn {
  position: relative;
  background: linear-gradient(135deg, #8710d8, #7209b7);
  color: white;
  font-weight: 500;
  height: 80px;
  letter-spacing: 1px;
  border-radius: 8px;
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(135, 16, 216, 0.2);
  text-transform: uppercase;
  font-size: 16px;
}

.signup-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.signup-btn:not(:disabled):hover::before {
  left: 100%;
}

.signup-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(135, 16, 216, 0.3);
  background: linear-gradient(135deg, #7209b7, #5b0894);
}

.signup-btn:disabled {
  background: linear-gradient(135deg, #a17eb8, #8e6aa3);
  cursor: not-allowed;
  opacity: 0.8;
}

.signup-btn .button-content,
.signup-btn .loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.signup-btn i {
  transition: transform 0.3s ease;
}

.signup-btn:not(:disabled):hover i {
  transform: translateX(5px) scale(1.1);
}

.signup-btn .fa-spinner {
  font-size: 18px;
}

/* Add shine animation */
@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.signup-btn:active:not(:disabled) {
  transform: scale(0.98);
}

/* Responsive styles for submit button */
@media (max-width: 768px) {
  .signup-btn {
    height: 50px;
    font-size: 14px;
  }

  .signup-btn .fa-spinner {
    font-size: 16px;
  }
}

/* Add these new styles for the buttons */
.btn-group-custom {
  gap: 10px;
  width: 100%;
}

.custom-btn {
  flex: 1;
  height: 38px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  font-size: 14px;
}

.file-input-container {
  flex: 1;
}

.file-input-container label {
  width: 100%;
  margin: 0;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Update responsive styles */
@media (max-width: 780px) {
  .custom-btn {
    min-width: unset;
    padding: 8px 10px;
    font-size: 13px;
  }

  .btn-group-custom {
    gap: 8px;
  }
}

/* Add new styles for passport guide */
.passport-guide {
  width: 60mm !important;
  height: 50mm !important;
  border: 2px solid rgba(0, 255, 0, 0.7);
  background: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Add check guide specific styles */
.check-guide {
  width: 90% !important; /* Wider for checks */
  height: 45% !important; /* Shorter height for checks */
  border: 2px solid rgba(0, 255, 0, 0.7);
  background: transparent;
}

/* Add these new styles for full image preview */
.image-preview-container img {
  cursor: pointer;
  transition: transform 0.2s;
}

.image-preview-container img:hover {
  transform: scale(1.05);
}

.full-image-container {
  width: 100%;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  overflow: hidden;
}

.full-preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

/* Add zoom effect on hover */
.preview-image {
  transition: transform 0.3s ease;
}

.preview-image:hover {
  transform: scale(1.05);
}

/* Add these styles for the select element */
select.form-control {
  height: 5vh;
  width: 100%;
  cursor: pointer;
  appearance: none;
  padding-right: 25px;
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    right 0.5rem center/1em no-repeat;
}

select.form-control:focus {
  outline: none;
}

select.form-control option {
  background: white;
  color: #333;
  padding: 8px;
}

/* Add these styles for the barcode scanner */
#barcodeReader {
  width: 100%;
  min-height: 300px;
}

#barcodeReader video {
  width: 100%;
  height: auto;
}

/* Add styles for the scan button */
.btn-outline-secondary {
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  border: 2px solid #4a4a4a;
  color: #4a4a4a;
}

.btn-outline-secondary:hover {
  background: #4a4a4a;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Add these new styles for the installment plan dropdown */
.plan-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s ease;
}

.plan-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plan-name {
  font-weight: 600;
  color: #8710d8;
  font-size: 1rem;
}

.plan-modal {
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #495057;
  text-transform: capitalize;
}

.plan-details {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 6px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: #6c757d;
  font-weight: 500;
}

.detail-value {
  color: #212529;
  font-weight: 600;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 9999; /* Increased z-index to appear above other elements */
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.location-btn {
  min-width: 130px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #3a0ca3, #4361ee);
  color: white;
  border: none;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 13px;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
  margin-right: 10px;
}

.location-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.location-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
}

.location-btn:not(:disabled):hover::before {
  left: 100%;
}

.location-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.location-btn i {
  font-size: 16px;
}

@media (max-width: 768px) {
  .location-btn {
    min-width: auto;
    padding: 8px;
  }

  .location-btn span {
    display: none;
  }
}
</style>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import SuccessPopup from '@/components/SuccessPopup.vue'
import ErrorPopup from '@/components/ErrorPopup.vue'
import { Modal } from 'bootstrap'
import { createWorker } from 'tesseract.js'
import { useRoute, useRouter } from 'vue-router' // Add this at the top with other imports

export default {
  components: {
    SuccessPopup,
    ErrorPopup,
  },

  setup() {
    const store = useStore()
    const loading = ref(false)
    const showSuccess = ref(false)
    const showError = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')
    const validationErrors = ref({})
    const currentUserRole = ref(store.getters.userRole)
    const companies = ref([])
    const branches = ref([])
    const route = useRoute()
    const router = useRouter() // Add this line near other refs

    const formData = ref({
      customer_id: route.query.customer_id || null,
      name: '',
      father_name: '',
      phone_number: '',
      cnic: '',
      relationship: '',
      address: '',
      office_address: '',
      employment_type: '',
      company_name: '',
      years_of_experience: '',
      cnic_front_image: null,
      cnic_back_image: null,
    })

    // Camera modal references
    const modal = ref(null)
    const videoElement = ref(null)
    const isModalVisible = ref(false)
    const processCanvas = ref(null)
    const displayCanvas = ref(null)
    const isCardDetected = ref(false)

    const worker = ref(null)
    const isProcessing = ref(false)
    const lastProcessedTime = ref(0)
    const PROCESS_INTERVAL = 1000 // Process every 1 second

    // Add new state for tracking detected values
    const detectedValues = ref({
      name: false,
      fatherName: false,
      cnic: false,
    })

    // Initialize OCR worker
    const initWorker = async () => {
      worker.value = await createWorker('eng')
    }

    // Process frame in real-time
    const processVideoFrame = async () => {
      if (!videoElement.value || isProcessing.value) return

      const currentTime = Date.now()
      if (currentTime - lastProcessedTime.value < PROCESS_INTERVAL) return

      try {
        isProcessing.value = true
        const canvas = document.createElement('canvas')
        const video = videoElement.value

        // Set canvas dimensions and draw frame
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)

        const {
          data: { text },
        } = await worker.value.recognize(canvas.toDataURL('image/jpeg'))

        // Improved text processing
        console.log('Raw OCR text:', text) // For debugging

        const lines = text
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)

        // Name detection
        if (!detectedValues.value.name) {
          for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i].toLowerCase()
            const nextLine = lines[i + 1]

            if ((currentLine.includes('name') || currentLine.match(/name\s*:/)) && nextLine) {
              const extractedName = nextLine.replace(/[^a-zA-Z\s]/g, '').trim()
              if (extractedName) {
                formData.value.name = extractedName
                detectedValues.value.name = true
                console.log('Found name:', extractedName)
              }
            }
          }
        }

        // Father's name detection
        if (!detectedValues.value.fatherName) {
          for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i].toLowerCase()
            const nextLine = lines[i + 1]

            if (
              (currentLine.includes('father') ||
                currentLine.includes("father's name") ||
                currentLine.match(/father.*name\s*:/)) &&
              nextLine
            ) {
              const extractedFatherName = nextLine.replace(/[^a-zA-Z\s]/g, '').trim()
              if (extractedFatherName) {
                formData.value.father_name = extractedFatherName
                detectedValues.value.fatherName = true
                console.log('Found father name:', extractedFatherName)
              }
            }
          }
        }

        // CNIC detection
        if (!detectedValues.value.cnic) {
          const cnicPattern = /(\d{5}[\s-]?\d{7}[\s-]?\d{1})/
          const cnicMatch = text.match(cnicPattern)
          if (cnicMatch) {
            const cnic = cnicMatch[1].replace(/\s/g, '-')
            formData.value.cnic = cnic
            detectedValues.value.cnic = true
            console.log('Found CNIC:', cnic)
          }
        }

        lastProcessedTime.value = currentTime
      } catch (error) {
        console.error('Real-time OCR error:', error)
      } finally {
        isProcessing.value = false
      }
    }

    const currentImageType = ref(null)
    const showCardGuide = computed(() =>
      ['cnic_front_image', 'cnic_back_image', 'customer_image', 'check_image'].includes(
        currentImageType.value,
      ),
    )

    const getGuideText = computed(() => {
      switch (currentImageType.value) {
        case 'customer_image':
          return 'Align face within frame'
        case 'cnic_front_image':
        case 'cnic_back_image':
          return 'Align ID card within the frame'
        case 'check_image':
          return 'Align check within the frame'
        default:
          return 'Position subject in frame'
      }
    })

    const isOcrEnabled = computed(() => ['cnic_front_image'].includes(currentImageType.value))

    // Modified openCameraModal to handle different image types
    const openCameraModal = async (imageType) => {
      try {
        // Reset detected values if it's CNIC front
        if (imageType === 'cnic_front_image') {
          detectedValues.value = {
            name: false,
            fatherName: false,
            cnic: false,
          }
        }

        currentImageType.value = imageType

        // Only initialize OCR worker for CNIC front image
        if (imageType === 'cnic_front_image') {
          await initWorker()
        }

        modal.value.show()
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        videoElement.value.srcObject = stream

        // Only start OCR processing for CNIC front image
        if (imageType === 'cnic_front_image') {
          const processInterval = setInterval(processVideoFrame, 1000)
          videoElement.value.dataset.processInterval = processInterval
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        showError.value = true
        errorMessage.value = 'Could not start camera. Please check camera permissions.'
      }
    }

    // Modified captureImage to handle different image types
    const captureImage = () => {
      if (!currentImageType.value) return

      const video = videoElement.value
      const videoRect = video.getBoundingClientRect()
      const guideElement = document.querySelector(
        currentImageType.value === 'customer_image' ? '.passport-guide' : '.card-guide',
      )
      const guideRect = guideElement.getBoundingClientRect()
      const canvas = document.createElement('canvas')

      // Calculate video to display ratio
      const videoAspectRatio = video.videoWidth / video.videoHeight
      const displayAspectRatio = videoRect.width / videoRect.height

      let videoDisplayWidth = videoRect.width
      let videoDisplayHeight = videoRect.height
      let offsetX = 0
      let offsetY = 0

      if (displayAspectRatio > videoAspectRatio) {
        // Display is wider than video
        videoDisplayWidth = videoDisplayHeight * videoAspectRatio
        offsetX = (videoRect.width - videoDisplayWidth) / 2
      } else {
        // Display is taller than video
        videoDisplayHeight = videoDisplayWidth / videoAspectRatio
        offsetY = (videoRect.height - videoDisplayHeight) / 2
      }

      // Calculate scaling factors
      const scaleX = video.videoWidth / videoDisplayWidth
      const scaleY = video.videoHeight / videoDisplayHeight

      // Calculate crop dimensions in actual video coordinates
      const cropX = Math.max(0, (guideRect.left - videoRect.left - offsetX) * scaleX)
      const cropY = Math.max(0, (guideRect.top - videoRect.top - offsetY) * scaleY)
      const cropWidth = guideRect.width * scaleX
      const cropHeight = guideRect.height * scaleY

      if (currentImageType.value === 'check_image') {
        canvas.width = 1280
        canvas.height = 720
      } else if (currentImageType.value === 'customer_image') {
        canvas.width = 708
        canvas.height = 590
      } else {
        canvas.width = 856
        canvas.height = 540
      }

      const ctx = canvas.getContext('2d')

      // Enable high-quality image scaling
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Draw and crop the image
      ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height)

      // Convert to blob with high quality
      canvas.toBlob(
        (blob) => {
          formData.value[currentImageType.value] = blob
          if (isOcrEnabled.value) {
            processOCR(blob)
          }
          stopScanner()

          // Show success message
          showSuccess.value = true
          successMessage.value = 'Image captured successfully!'
          setTimeout(() => {
            showSuccess.value = false
          }, 2000)
        },
        'image/jpeg',
        0.95, // High quality for all images
      )
    }

    // Modify stopScanner to cleanup OCR
    const stopScanner = () => {
      if (videoElement.value) {
        // Clear processing interval
        const intervalId = videoElement.value.dataset.processInterval
        if (intervalId) clearInterval(intervalId)

        // Stop video tracks
        const tracks = videoElement.value.srcObject?.getTracks() || []
        tracks.forEach((track) => track.stop())
        videoElement.value.srcObject = null
      }

      // Terminate OCR worker
      if (worker.value) {
        worker.value.terminate()
        worker.value = null
      }

      modal.value.hide()
    }

    // Clean up on component unmount
    onBeforeUnmount(() => {
      stopScanner()
      // Remove event listeners
      document.removeEventListener('click', handleClickOutside)
    })

    // ===================================
    //            ON MOUNT
    // ===================================
    onMounted(() => {
      console.log('Customer ID:', formData.value.customer_id)
      modal.value = new Modal(document.getElementById('scannerModal'))
      imagePreviewModal.value = new Modal(document.getElementById('imagePreviewModal'))
    })

    onMounted(async () => {
      const userRole = store.getters.getUserRole
      console.log('Current user role:', userRole)
    })

    // ===================================
    //          FORM SUBMISSION
    // ===================================
    const submitForm = async () => {
      try {
        loading.value = true
        validationErrors.value = {}
        showSuccess.value = false
        showError.value = false
        errorMessage.value = ''

        const result = await store.dispatch('customerStore/registerGuarantor', formData.value)

        if (result.success) {
          showSuccess.value = true
          successMessage.value = result.message
          resetForm()
          setTimeout(() => {
            router.push({ name: 'home' })
          }, 1500)
        } else {
          showError.value = true
          errorMessage.value = result.message

          // Handle validation errors
          if (result.errors) {
            validationErrors.value = result.errors
            // Format validation messages for display
            Object.keys(result.errors).forEach((key) => {
              result.errors[key] = Array.isArray(result.errors[key])
                ? result.errors[key]
                : [result.errors[key]]
            })
          }
        }
      } catch (error) {
        console.error('Form submission error:', error)
        showError.value = true
        errorMessage.value = 'An unexpected error occurred'
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      const customerId = formData.value.customer_id // Store current customer_id
      formData.value = {
        customer_id: customerId, // Keep the same customer_id
        name: '',
        father_name: '',
        phone_number: '',
        cnic: '',
        relationship: '',
        address: '',
        office_address: '',
        employment_type: '',
        company_name: '',
        years_of_experience: '',
        cnic_front_image: null,
        cnic_back_image: null,
      }
      validationErrors.value = {}

      // Reset file inputs
      const fileInputs = ['cnic_front_image', 'cnic_back_image']
      fileInputs.forEach((field) => {
        const input = document.getElementById(field)
        if (input) {
          input.value = ''
        }
      })
    }

    // Computed properties to check user roles
    const userRole = computed(() => store.getters.getUserRole)

    const isAdmin = computed(() => {
      return userRole.value === 'admin'
    })

    const isAdminOrCompanyAdmin = computed(() => {
      return ['admin', 'company admin'].includes(userRole.value)
    })

    // ===================================
    //    FILE HANDLING & OCR
    // ===================================
    const handleFileUpload = async (field, event) => {
      const file = event.target.files[0]
      if (file) {
        formData.value[field] = file

        // Only process OCR for CNIC front image
        if (field === 'cnic_front_image') {
          await processOCR(file)
        }

        // Clear validation error for this field if it exists
        if (validationErrors.value[field]) {
          validationErrors.value = { ...validationErrors.value, [field]: [] }
        }
      }
    }

    const processOCR = async (imageBlob) => {
      try {
        loading.value = true
        const worker = await createWorker('eng')

        const reader = new FileReader()
        reader.readAsDataURL(imageBlob)

        reader.onload = async () => {
          try {
            const {
              data: { text },
            } = await worker.recognize(reader.result)

            // Extract and process text
            const cleanedText = text.replace(/[^a-zA-Z0-9:\-\s']/g, '')
            const lines = cleanedText
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line)

            // Extract data
            let nameExtracted = ''
            let fatherExtracted = ''
            const cnicPattern = /(\d{5}-\d{7}-\d{1}|\d{13})/
            const cnicMatch = cleanedText.match(cnicPattern)

            // Process extracted data
            for (let i = 0; i < lines.length; i++) {
              if (/^Name\s*:?\s*/i.test(lines[i]) && i + 1 < lines.length) {
                nameExtracted = lines[i + 1]
              }
              if (/^Father'?s?\s*Name\s*:?\s*$/i.test(lines[i]) && i + 1 < lines.length) {
                fatherExtracted = lines[i + 1]
              }
            }

            // Update form data
            if (nameExtracted) formData.value.name = nameExtracted
            if (fatherExtracted) formData.value.father_name = fatherExtracted
            if (cnicMatch) formData.value.cnic = cnicMatch[1]

            await worker.terminate()
          } catch (error) {
            console.error('OCR processing error:', error)
            showError.value = true
            errorMessage.value = 'Error extracting information from image'
          }
        }

        reader.onerror = () => {
          showError.value = true
          errorMessage.value = 'Error reading image file'
        }
      } catch (error) {
        console.error('OCR initialization error:', error)
        showError.value = true
        errorMessage.value = 'Error initializing text recognition'
      } finally {
        loading.value = false
      }
    }

    // Image preview and removal functions
    const getImagePreviewUrl = (blob) => {
      return blob instanceof Blob ? URL.createObjectURL(blob) : blob
    }

    const removeImage = (field) => {
      formData.value[field] = null
    }

    // Add these new refs and functions for image preview
    const imagePreviewModal = ref(null)
    const selectedImageUrl = ref('')

    // Add function to open full image preview
    const openImagePreview = (imageField) => {
      const image = formData.value[imageField]
      if (image) {
        selectedImageUrl.value = getImagePreviewUrl(image)
        imagePreviewModal.value.show()
      }
    }

    // Add function to close image preview
    const closeImagePreview = () => {
      imagePreviewModal.value.hide()
      selectedImageUrl.value = ''
    }

    // Add these new refs for barcode scanner
    const installmentPlanSearch = ref('')
    const showInstallmentPlanDropdown = ref(false)
    const installmentPlans = ref([])

    // Add computed property for filtered plans
    const filteredInstallmentPlans = computed(() => {
      let plans = installmentPlans.value

      // Filter by search term if present
      if (installmentPlanSearch.value) {
        const searchTerm = installmentPlanSearch.value.toLowerCase()
        plans = plans.filter(
          (plan) =>
            plan.plan_name.toLowerCase().includes(searchTerm) ||
            plan.Product_name.toLowerCase().includes(searchTerm) ||
            plan.Product_model.toLowerCase().includes(searchTerm),
        )
      }

      // Filter by item name or model if present
      if (formData.value.item_name || formData.value.model) {
        plans = plans.filter((plan) => {
          const itemNameMatch = formData.value.item_name
            ? plan.Product_name.toLowerCase().includes(formData.value.item_name.toLowerCase())
            : true
          const modelMatch = formData.value.model
            ? plan.Product_model.toLowerCase().includes(formData.value.model.toLowerCase())
            : true
          return itemNameMatch || modelMatch
        })
      }

      return plans
    })

    const handleItemOrModelChange = () => {
      formData.value.installment_plan_id = ''
      showInstallmentPlanDropdown.value = true

      if (filteredInstallmentPlans.value.length === 1) {
        selectInstallmentPlan(filteredInstallmentPlans.value[0])
      }
    }

    watch(
      () => formData.value.item_name,
      (newVal) => {
        if (!newVal) {
          handleItemOrModelChange()
        }
      },
    )

    watch(
      () => formData.value.model,
      (newVal) => {
        if (!newVal) {
          handleItemOrModelChange()
        }
      },
    )

    // Add computed property for selected plan display
    const selectedPlan = computed(() => {
      const plan = installmentPlans.value.find((p) => p.id === formData.value.installment_plan_id)
      if (plan) {
        return `${plan.plan_name} - ${plan.Product_name} (${plan.Product_model})`
      }
      return ''
    })

    // Update selectInstallmentPlan method
    const selectInstallmentPlan = (plan) => {
      formData.value.installment_plan_id = plan.id
      installmentPlanSearch.value = `${plan.plan_name} - ${plan.Product_name} (${plan.Product_model})`
      showInstallmentPlanDropdown.value = false
    }

    // Add method to fetch installment plans
    const fetchInstallmentPlans = async () => {
      try {
        const result = await store.dispatch('installmentPlanStore/getAllInstallmentPlans')
        if (result.success) {
          installmentPlans.value = result.plans || []
        } else {
          console.error('Failed to load installment plans:', result.message)
        }
      } catch (error) {
        console.error('Error in fetchInstallmentPlans:', error)
      }
    }

    // Define click outside handler
    const handleClickOutside = (e) => {
      const dropdown = document.querySelector('.search-select-container')
      if (dropdown && !dropdown.contains(e.target)) {
        showInstallmentPlanDropdown.value = false
      }
    }

    // Update onMounted to add event listener
    onMounted(() => {
      fetchInstallmentPlans()
      modal.value = new Modal(document.getElementById('scannerModal'))
      imagePreviewModal.value = new Modal(document.getElementById('imagePreviewModal'))
      // Add click outside listener
      document.addEventListener('click', handleClickOutside)
    })

    const isLoadingLocation = ref(false)

    const getCurrentLocation = async () => {
      if (!navigator.geolocation) {
        showError.value = true
        errorMessage.value = 'Geolocation is not supported by your browser'
        return
      }

      try {
        isLoadingLocation.value = true

        // Get current position
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })

        const { latitude, longitude } = position.coords

        // Use reverse geocoding with Nominatim API (OpenStreetMap)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        )
        const data = await response.json()

        const addressComponents = data.address

        const address = [
          addressComponents.road,
          addressComponents.neighbourhood,
          addressComponents.suburb,
          addressComponents.village,
          addressComponents.town || addressComponents.city,
          addressComponents.county,
          addressComponents.state,
          addressComponents.country,
        ]
          .filter(Boolean)
          .join(', ')

        formData.value.address = address

        showSuccess.value = true
        successMessage.value = 'Location fetched successfully!'

        setTimeout(() => {
          showSuccess.value = false
        }, 3000)
      } catch (error) {
        console.error('Error getting location:', error)
        showError.value = true
        errorMessage.value = 'Unable to fetch your location. Please try again or enter manually.'
      } finally {
        isLoadingLocation.value = false
      }
    }

    const getCurrentOfficeLocation = async () => {
      if (!navigator.geolocation) {
        showError.value = true
        errorMessage.value = 'Geolocation is not supported by your browser'
        return
      }

      try {
        isLoadingLocation.value = true

        // Get current position
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })

        const { latitude, longitude } = position.coords

        // Use reverse geocoding with Nominatim API (OpenStreetMap)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        )
        const data = await response.json()

        const addressComponents = data.address

        const address = [
          addressComponents.road,
          addressComponents.neighbourhood,
          addressComponents.suburb,
          addressComponents.village,
          addressComponents.town || addressComponents.city,
          addressComponents.county,
          addressComponents.state,
          addressComponents.country,
        ]
          .filter(Boolean)
          .join(', ')

        formData.value.office_address = address

        showSuccess.value = true
        successMessage.value = 'Office location fetched successfully!'

        setTimeout(() => {
          showSuccess.value = false
        }, 3000)
      } catch (error) {
        console.error('Error getting location:', error)
        showError.value = true
        errorMessage.value = 'Unable to fetch your location. Please try again or enter manually.'
      } finally {
        isLoadingLocation.value = false
      }
    }

    // Add validation styles for file inputs
    const getInputClass = (fieldName) => {
      return {
        'error-border': validationErrors.value[fieldName]?.length > 0,
      }
    }

    return {
      loading,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      validationErrors,
      currentUserRole,
      companies,
      branches,
      formData,
      modal,
      videoElement,
      isModalVisible,
      processCanvas,
      displayCanvas,
      isCardDetected,
      worker,
      isProcessing,
      lastProcessedTime,
      PROCESS_INTERVAL,
      detectedValues,
      initWorker,
      processVideoFrame,
      currentImageType,
      showCardGuide,
      getGuideText,
      isOcrEnabled,
      openCameraModal,
      captureImage,
      stopScanner,
      submitForm,
      resetForm,
      userRole,
      isAdmin,
      isAdminOrCompanyAdmin,
      handleFileUpload,
      processOCR,
      getImagePreviewUrl,
      removeImage,
      imagePreviewModal,
      selectedImageUrl,
      openImagePreview,
      closeImagePreview,
      installmentPlanSearch,
      showInstallmentPlanDropdown,
      installmentPlans,
      filteredInstallmentPlans,
      handleItemOrModelChange,
      selectedPlan,
      selectInstallmentPlan,
      fetchInstallmentPlans,
      getCurrentLocation,
      isLoadingLocation,
      handleClickOutside,
      getCurrentOfficeLocation,
      getInputClass, // Add this to the return object
    }
  },
}
</script>
