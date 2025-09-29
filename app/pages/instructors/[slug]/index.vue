<template>
  <div>
    <div class="space-y-2">
      <NuxtLink
        to="/instructors"
        class="flex items-center gap-2 text-headingColor text-sm"
      >
        <Icon name="material-symbols:arrow-back-rounded" />
        <span> Instructors </span>
      </NuxtLink>
      <h1 class="text-headingColor text-3xl">{{ isCreateMode ? 'Create a new Instructor' : 'Edit Instructor' }}</h1>
    </div>

    <div class="flex gap-6 pt-6 w-full">
      <div class="flex flex-col items-center bg-darkForground p-6 rounded-xl w-[20%]">
        <h3 class="pb-5 text-headingColor text-2xl text-center">Profile Picture</h3>

        <div class="flex justify-center items-center bg-[#292D32] rounded-full w-60 min-h-60 overflow-hidden">
          <img 
            v-if="form.photo_url" 
            :src="form.photo_url" 
            alt="Profile Picture" 
            class="w-full h-full object-cover"
          />
          <Icon 
            v-else 
            name="material-symbols:person" 
            class="w-36 h-36 text-darkBackground" 
          />
        </div>

        <div class="flex flex-col justify-center items-center gap-4 pt-6">
          <div
            class="group bg-gradient-to-r from-[#00B9FF] to-[#4E47FF] p-px rounded-lg w-fit"
          >
            <label
              for="photo-upload"
              class="flex bg-darkForground group-hover:bg-transparent px-4 py-2 rounded-lg w-full text-white text-sm transition-all cursor-pointer"
            >
              {{ form.photo_url ? 'Change Photo' : 'Upload Photo' }}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              @change="handlePhotoUpload"
              class="hidden"
            />
          </div>
          <button
            v-if="form.photo_url"
            @click="removePhoto"
            class="text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            Remove Photo
          </button>
          <p class="opacity-50 max-w-48 text-[#E2E2E2] text-sm text-center">
            at least 536 x 300px PNG or JPG file.
          </p>
          
          <!-- Photo error message -->
          <div v-if="photoError" class="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center max-w-48">
            {{ photoError }}
          </div>
        </div>
      </div>
      <div class="bg-darkForground p-6 rounded-xl w-[60%]">
        <h3 class="pb-5 text-headingColor text-2xl">Instructor information</h3>

        <form @submit="handleSubmit" class="gap-5 grid grid-cols-2">
          <div class="flex flex-col gap-2 col-span-1">
            <label for="first_name" class="text-headingColor">First Name <span class="text-red-400">*</span></label>
            <input
              type="text"
              v-model="form.first_name"
              @input="clearFieldError('first_name')"
              placeholder="Enter first name"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                validationErrors.first_name ? 'border border-red-400' : ''
              ]"
            />
            <span v-if="validationErrors.first_name" class="text-red-400 text-xs">{{ validationErrors.first_name }}</span>
          </div>
          <div class="flex flex-col gap-2 col-span-1">
            <label for="last_name" class="text-headingColor">Last Name <span class="text-red-400">*</span></label>
            <input
              type="text"
              v-model="form.last_name"
              @input="clearFieldError('last_name')"
              placeholder="Enter last name"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                validationErrors.last_name ? 'border border-red-400' : ''
              ]"
            />
            <span v-if="validationErrors.last_name" class="text-red-400 text-xs">{{ validationErrors.last_name }}</span>
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <label for="email" class="text-headingColor">Email <span class="text-red-400">*</span></label>
            <input
              type="email"
              v-model="form.email"
              @input="clearFieldError('email')"
              placeholder="Enter email address"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                validationErrors.email ? 'border border-red-400' : ''
              ]"
            />
            <span v-if="validationErrors.email" class="text-red-400 text-xs">{{ validationErrors.email }}</span>
          </div>
          
          <div class="flex flex-col gap-2 col-span-1">
            <label for="phone" class="text-headingColor">Phone</label>
            <input
              type="tel"
              v-model="form.phone"
              @input="clearFieldError('phone')"
              placeholder="Enter phone number"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                validationErrors.phone ? 'border border-red-400' : ''
              ]"
            />
            <span v-if="validationErrors.phone" class="text-red-400 text-xs">{{ validationErrors.phone }}</span>
          </div>
          
          <div class="flex flex-col gap-2 col-span-1">
            <label for="expertise" class="text-headingColor">Expertise</label>
            <input
              type="text"
              v-model="form.expertise"
              @input="clearFieldError('expertise')"
              placeholder="Enter areas of expertise (comma-separated)"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                validationErrors.expertise ? 'border border-red-400' : ''
              ]"
            />
            <span v-if="validationErrors.expertise" class="text-red-400 text-xs">{{ validationErrors.expertise }}</span>
          </div>
          
          <div class="flex flex-col gap-2 col-span-1">
            <label for="years_of_experience" class="text-headingColor">Years of Experience</label>
            <input
              type="number"
              v-model.number="form.years_of_experience"
              @input="clearFieldError('years_of_experience')"
              min="0"
              placeholder="Enter years of experience"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                validationErrors.years_of_experience ? 'border border-red-400' : ''
              ]"
            />
            <span v-if="validationErrors.years_of_experience" class="text-red-400 text-xs">{{ validationErrors.years_of_experience }}</span>
          </div>
          
          <div class="flex flex-col gap-2 col-span-1">
            <label for="linkedin_url" class="text-headingColor">LinkedIn URL</label>
            <input
              type="url"
              v-model="form.linkedin_url"
              @input="clearFieldError('linkedin_url')"
              placeholder="Enter LinkedIn profile URL"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                validationErrors.linkedin_url ? 'border border-red-400' : ''
              ]"
            />
            <span v-if="validationErrors.linkedin_url" class="text-red-400 text-xs">{{ validationErrors.linkedin_url }}</span>
          </div>
          
          <div class="flex flex-col gap-2 col-span-2">
            <label for="bio" class="text-headingColor">Bio</label>
            <textarea
              v-model="form.bio"
              placeholder="Enter bio"
              rows="4"
              class="bg-darkBackground px-4 py-3 rounded-lg placeholder:text-headingColor/30 text-sm text-white"
              name="bio"
              id="bio"
            ></textarea>
          </div>
          
          <div class="flex flex-col gap-2 col-span-1">
            <label for="github_url" class="text-headingColor">GitHub URL</label>
            <input
              type="url"
              v-model="form.github_url"
              @input="clearFieldError('github_url')"
              placeholder="Enter GitHub profile URL"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                validationErrors.github_url ? 'border border-red-400' : ''
              ]"
            />
            <span v-if="validationErrors.github_url" class="text-red-400 text-xs">{{ validationErrors.github_url }}</span>
          </div>
          
          <div class="flex flex-col gap-2 col-span-1">
            <label for="website_url" class="text-headingColor">Website URL</label>
            <input
              type="url"
              v-model="form.website_url"
              @input="clearFieldError('website_url')"
              placeholder="Enter personal website URL"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                validationErrors.website_url ? 'border border-red-400' : ''
              ]"
            />
            <span v-if="validationErrors.website_url" class="text-red-400 text-xs">{{ validationErrors.website_url }}</span>
          </div>
          
          <div class="flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              v-model="form.is_active"
              id="is_active"
              class="rounded border-gray-300 text-blue-600"
            />
            <label for="is_active" class="text-headingColor">Active Instructor</label>
          </div>

          <!-- Error message -->
          <div v-if="error" class="col-span-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ error }}
          </div>

          <div class="pt-3 col-span-2">
            <button
              type="submit"
              :disabled="submitting || loading"
              class="bg-[#292D32] hover:bg-[#3a3f45] px-5 py-2.5 rounded-lg text-headingColor disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="submitting">{{ isCreateMode ? 'Creating...' : 'Updating...' }}</span>
              <span v-else>{{ isCreateMode ? 'Create Instructor' : 'Update Instructor' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InstructorForm {
  first_name: string
  last_name: string
  email: string
  phone: string
  bio: string
  expertise: string
  years_of_experience: number
  linkedin_url: string
  github_url: string
  website_url: string
  is_active: boolean
  photo: File | null
  photo_url: string
}

// Route and navigation
const route = useRoute()
const router = useRouter()
const { slug } = route.params

// Determine if we're in create mode
const isCreateMode = computed(() => slug === 'create')

// Form state
const form = ref<InstructorForm>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  bio: '',
  expertise: '',
  years_of_experience: 0,
  linkedin_url: '',
  github_url: '',
  website_url: '',
  is_active: true,
  photo: null,
  photo_url: ''
})

// Loading and error states
const loading = ref(false)
const submitting = ref(false)
const error = ref('')

// Photo upload state
const photoError = ref('')

// Validation errors
const validationErrors = ref<Record<string, string>>({})

// Validation rules based on backend model
const validateForm = () => {
  const errors: Record<string, string> = {}
  
  // Required fields validation
  if (!form.value.first_name.trim()) {
    errors.first_name = 'First name is required'
  } else if (form.value.first_name.length > 100) {
    errors.first_name = 'First name must be 100 characters or less'
  }
  
  if (!form.value.last_name.trim()) {
    errors.last_name = 'Last name is required'
  } else if (form.value.last_name.length > 100) {
    errors.last_name = 'Last name must be 100 characters or less'
  }
  
  if (!form.value.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  // Optional field validations
  if (form.value.phone && form.value.phone.length > 20) {
    errors.phone = 'Phone number must be 20 characters or less'
  }
  
  if (form.value.expertise && form.value.expertise.length > 500) {
    errors.expertise = 'Expertise must be 500 characters or less'
  }
  
  if (form.value.years_of_experience < 0) {
    errors.years_of_experience = 'Years of experience cannot be negative'
  }
  
  // URL validations
  if (form.value.linkedin_url && !isValidUrl(form.value.linkedin_url)) {
    errors.linkedin_url = 'Please enter a valid LinkedIn URL'
  }
  
  if (form.value.github_url && !isValidUrl(form.value.github_url)) {
    errors.github_url = 'Please enter a valid GitHub URL'
  }
  
  if (form.value.website_url && !isValidUrl(form.value.website_url)) {
    errors.website_url = 'Please enter a valid website URL'
  }
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

// URL validation helper
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Clear validation error for a specific field
const clearFieldError = (fieldName: string) => {
  if (validationErrors.value[fieldName]) {
    delete validationErrors.value[fieldName]
  }
}

// Composable for API calls
const { getInstructor, createInstructor, updateInstructor } = useInstructors()

// Load instructor data if in edit mode
const loadInstructor = async () => {
  if (isCreateMode.value) return

  try {
    loading.value = true
    error.value = ''
    
    const result = await getInstructor(slug as string)
    
    if (result.error) {
      // Handle validation errors from backend
      if (typeof result.error === 'object' && result.error !== null) {
        // If it's a validation error object with field-specific errors
        const backendErrors = result.error as Record<string, string[]>
        const fieldErrors: Record<string, string> = {}
        
        for (const [field, messages] of Object.entries(backendErrors)) {
          if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[field] = String(messages[0])
          }
        }
        
        if (Object.keys(fieldErrors).length > 0) {
          validationErrors.value = { ...validationErrors.value, ...fieldErrors }
          error.value = 'Please fix the validation errors below'
        } else {
          error.value = 'Validation failed. Please check your input.'
        }
      } else {
          error.value = String(result.error) || 'An error occurred'
        }
      return
    }
    
    if (result.data && typeof result.data === 'object') {
      const instructorData = result.data as any
      // Populate form with instructor data
      Object.assign(form.value, {
        ...instructorData,
        photo: null, // File object will be null initially
        photo_url: instructorData.photo_url || '' // Use existing photo URL if available
      })
    } else {
      error.value = 'Instructor not found'
    }
    
  } catch (err) {
    error.value = 'Failed to load instructor data'
    console.error('Error loading instructor:', err)
  } finally {
    loading.value = false
  }
}

// Handle form submission
const handleSubmit = async (event?: Event) => {
  if (event) {
    event.preventDefault()
  }
  
  try {
    submitting.value = true
    error.value = ''
    
    // Validate form before submission
    if (!validateForm()) {
      submitting.value = false
      error.value = 'Please fix the validation errors below'
      return
    }

    const { createInstructor, updateInstructor } = useInstructors()

    // Prepare form data including profile image
    const formData = {
      first_name: form.value.first_name.trim(),
      last_name: form.value.last_name.trim(),
      email: form.value.email.trim(),
      phone: form.value.phone?.trim() || null,
      expertise: form.value.expertise?.trim() || null,
      years_of_experience: form.value.years_of_experience,
      bio: form.value.bio?.trim() || null,
      linkedin_url: form.value.linkedin_url?.trim() || null,
      github_url: form.value.github_url?.trim() || null,
      website_url: form.value.website_url?.trim() || null,
      is_active: form.value.is_active,
      profile_image: form.value.photo // Include the actual File object
    }

    let result
    if (isCreateMode.value) {
      // Create new instructor
      result = await createInstructor(formData)
    } else {
      // Update existing instructor
      result = await updateInstructor(slug as string, formData)
    }

    if (result.error) {
      error.value = result.error
      return
    }

    // Redirect to instructors list with success message
    const successParam = isCreateMode.value ? 'created=true' : 'updated=true'
    await router.push(`/instructors?${successParam}`)
    
  } catch (err) {
    error.value = isCreateMode.value 
      ? 'Failed to create instructor. Please try again.'
      : 'Failed to update instructor. Please try again.'
    console.error('Error submitting form:', err)
  } finally {
    submitting.value = false
  }
}

// Photo upload handlers
const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Reset previous errors
  photoError.value = ''
  
  // Validate file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    photoError.value = 'Please select a PNG or JPG file.'
    target.value = ''
    return
  }
  
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    photoError.value = 'File size must be less than 5MB.'
    target.value = ''
    return
  }
  
  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.photo_url = e.target?.result as string
    form.value.photo = file
  }
  reader.readAsDataURL(file)
}

const removePhoto = () => {
  form.value.photo = null
  form.value.photo_url = ''
  photoError.value = ''
  
  // Clear the file input
  const fileInput = document.getElementById('photo-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// Load data on mount
onMounted(() => {
  loadInstructor()
})

// Set page title
useHead({
  title: computed(() => isCreateMode.value ? 'Create Instructor' : 'Edit Instructor')
})
</script>
