<template>
  <div class="container-fluid d-flex align-items-center justify-content-center bg-white my-4">
    <div class="row w-75 shadow-lg">
      <!-- Right Side - Add Employee Form -->
      <div class="col-md-12 bg-white p-5">
        <h1 class="mb-4 fs-3 fw-bold">Add Customer</h1>

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

        <!-- Customer Add Form -->
        <form @submit.prevent="submitForm">
          <!-- File Uploads -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <div v-if="formData.cnic_front_image" class="image-preview-container">
                <img
                  :src="getImagePreviewUrl(formData.cnic_front_image)"
                  class="preview-image"
                  alt="CNIC Front"
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
            <div class="inputs position-relative w-48">
              <div v-if="formData.cnic_back_image" class="image-preview-container">
                <img
                  :src="getImagePreviewUrl(formData.cnic_back_image)"
                  class="preview-image"
                  alt="CNIC Back"
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

          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <div v-if="formData.customer_image" class="image-preview-container">
                <img
                  :src="getImagePreviewUrl(formData.customer_image)"
                  class="preview-image"
                  alt="Customer"
                />
                <button @click="removeImage('customer_image')" class="remove-image-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-else class="d-flex btn-group-custom">
                <button
                  @click="openCameraModal('customer_image')"
                  class="btn btn-primary custom-btn"
                >
                  <i class="fas fa-camera me-2"></i>Capture
                </button>
                <div class="file-input-container">
                  <input
                    type="file"
                    id="customer_image"
                    @change="handleFileUpload('customer_image', $event)"
                    class="form-control border-0 d-none"
                    accept="image/*"
                  />
                  <label for="customer_image" class="btn btn-secondary custom-btn">
                    <i class="fas fa-file-upload me-2"></i>Choose
                  </label>
                </div>
              </div>
              <label for="customer_image" class="form-label notwrok">Customer Image</label>
            </div>
            <div class="inputs position-relative w-48">
              <div v-if="formData.check_image" class="image-preview-container">
                <img
                  :src="getImagePreviewUrl(formData.check_image)"
                  class="preview-image"
                  alt="Check"
                />
                <button @click="removeImage('check_image')" class="remove-image-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-else class="d-flex btn-group-custom">
                <button @click="openCameraModal('check_image')" class="btn btn-primary custom-btn">
                  <i class="fas fa-camera me-2"></i>Capture
                </button>
                <div class="file-input-container">
                  <input
                    type="file"
                    id="check_image"
                    @change="handleFileUpload('check_image', $event)"
                    class="form-control border-0 d-none"
                    accept="image/*"
                  />
                  <label for="check_image" class="btn btn-secondary custom-btn">
                    <i class="fas fa-file-upload me-2"></i>Choose
                  </label>
                </div>
              </div>
              <label for="check_image" class="form-label notwrok">Check Image</label>
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

          <!-- Address and Office Address -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <textarea
                id="address"
                v-model="formData.address"
                class="form-control border-0"
                required
                placeholder=" "
              ></textarea>
              <label for="address" class="form-label">Address</label>
            </div>
            <div class="inputs position-relative w-48">
              <textarea
                id="office_address"
                v-model="formData.office_address"
                class="form-control border-0"
                required
                placeholder=" "
              ></textarea>
              <label for="office_address" class="form-label">Office Address</label>
            </div>
          </div>

          <!-- Employment Type and Company Name -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="employment_type"
                v-model="formData.employment_type"
                class="form-control border-0"
                required
                placeholder=" "
              />
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
              <label for="company_name" class="form-label">Company Name</label>
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

          <!-- Item Name and Model -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="item_name"
                v-model="formData.item_name"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="item_name" class="form-label">Item Name</label>
            </div>
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="model"
                v-model="formData.model"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="model" class="form-label">Model</label>
            </div>
          </div>

          <!-- Installment Plan ID -->
          <div class="mb-3 inputs position-relative">
            <input
              type="number"
              id="installment_plan_id"
              v-model="formData.installment_plan_id"
              class="form-control border-0"
              required
              placeholder=" "
            />
            <label for="installment_plan_id" class="form-label">Installment Plan ID</label>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn signup-btn w-100 fw-bold" :disabled="loading">
            <span v-if="loading" class="loading-content">
              <i class="fa fa-spinner fa-spin me-2"></i> Submitting...
            </span>
            <span v-else class="button-content">
              Add Customer
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
            <div v-if="isOcrEnabled" class="card-guide">
              <div class="corner-tl"></div>
              <div class="corner-tr"></div>
              <div class="corner-bl"></div>
              <div class="corner-br"></div>
            </div>
            <div class="guide-text">
              {{ isOcrEnabled ? 'Align ID card within the frame' : 'Position subject in frame' }}
            </div>
            <button @click="captureImage" class="capture-btn">
              <i class="fas fa-camera"></i>
            </button>
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
  top: 20%;
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
</style>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import SuccessPopup from '@/components/SuccessPopup.vue'
import ErrorPopup from '@/components/ErrorPopup.vue'
import { Modal } from 'bootstrap'
import { createWorker } from 'tesseract.js'

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

    const formData = ref({
      name: '',
      father_name: '',
      phone_number: '',
      cnic: '',
      address: '',
      office_address: '',
      employment_type: '',
      company_name: '',
      years_of_experience: '',
      cnic_front_image: null,
      customer_image: null,
      check_image: null,
      cnic_back_image: null,
      item_name: '',
      model: '',
      installment_plan_id: '',
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
    const isOcrEnabled = computed(() =>
      ['cnic_front_image', 'cnic_back_image'].includes(currentImageType.value),
    )

    // Modified openCameraModal to handle different image types
    const openCameraModal = async (imageType) => {
      try {
        // Reset detected values
        detectedValues.value = {
          name: false,
          fatherName: false,
          cnic: false,
        }

        currentImageType.value = imageType

        // Only initialize OCR worker for CNIC images
        if (isOcrEnabled.value) {
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

        // Only start OCR processing for CNIC images
        if (isOcrEnabled.value) {
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
      const guideElement = document.querySelector('.card-guide')
      const guideRect = guideElement.getBoundingClientRect()

      // Calculate scaling factors
      const scaleX = video.videoWidth / videoRect.width
      const scaleY = video.videoHeight / videoRect.height

      // Calculate crop dimensions
      const cropX = (guideRect.left - videoRect.left) * scaleX
      const cropY = (guideRect.top - videoRect.top) * scaleY
      const cropWidth = guideRect.width * scaleX
      const cropHeight = guideRect.height * scaleY

      // Create canvas with guide frame dimensions
      const canvas = document.createElement('canvas')
      canvas.width = cropWidth
      canvas.height = cropHeight

      const ctx = canvas.getContext('2d')
      // Draw only the cropped portion
      ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

      // Convert to blob and save
      canvas.toBlob(
        (blob) => {
          formData.value[currentImageType.value] = blob
          if (isOcrEnabled.value) {
            processOCR(blob)
          }
          stopScanner()
        },
        'image/jpeg',
        0.95,
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
    })

    // ===================================
    //            ON MOUNT
    // ===================================
    onMounted(() => {
      modal.value = new Modal(document.getElementById('scannerModal'))
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
        errorMessage.value = ''
        validationErrors.value = {}
        showSuccess.value = false
        showError.value = false

        const result = await store.dispatch('registerCustomer', formData.value)

        if (result.success) {
          showSuccess.value = true
          successMessage.value = 'Customer registered successfully!'
          resetForm()
        } else {
          if (result.errors) {
            validationErrors.value = result.errors
            showError.value = true
            errorMessage.value = 'Please correct the errors below.'
          } else {
            showError.value = true
            errorMessage.value = result.message || 'Registration failed'
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
      formData.value = {
        name: '',
        father_name: '',
        phone_number: '',
        cnic: '',
        address: '',
        office_address: '',
        employment_type: '',
        company_name: '',
        years_of_experience: '',
        cnic_front_image: null,
        customer_image: null,
        check_image: null,
        cnic_back_image: null,
        item_name: '',
        model: '',
        installment_plan_id: '',
      }
      validationErrors.value = {}

      // Reset file inputs
      const fileInputs = ['cnic_front_image', 'cnic_back_image', 'customer_image', 'check_image']
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

        // Process OCR on the uploaded image
        await processOCR(file)

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

    // Return all required refs and functions
    return {
      formData,
      loading,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      validationErrors,
      handleFileUpload,
      submitForm,
      resetForm,
      currentUserRole,
      isAdmin,
      isAdminOrCompanyAdmin,
      companies,
      branches,
      captureImage,
      processOCR,
      stopScanner,
      openCameraModal,
      videoElement,
      isModalVisible,
      getImagePreviewUrl,
      removeImage,
      processCanvas,
      displayCanvas,
      isCardDetected,
      isProcessing,
      currentImageType,
      isOcrEnabled,
      detectedValues,
    }
  },
}
</script>
