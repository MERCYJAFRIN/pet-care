# Appointment Booking Process Guide

## Overview
The Pet Care application now includes a comprehensive appointment booking system with doctor profile information, payment integration, and animated UI components for a better user experience.

---

## 📋 Appointment Booking Workflow

### Step 1: Access the Appointments Page
1. Log in to your Pet Care account
2. Navigate to the **Appointments** section from the sidebar or main menu
3. You'll see any existing appointments and an **"Add Appointment"** button

### Step 2: Click "Add New Appointment"
- Click the **"Add New Appointment"** button
- The appointment form will expand vertically below the button
- The form includes sections for:
  - Pet Selection
  - Doctor Information
  - Appointment Details
  - Payment Information

### Step 3: Fill in Pet Information
**Pet Selection Section:**
- **Select Pet*** (Required): Choose your pet from the dropdown list
- Only pets you've added to the system will appear in this list
- If you haven't added any pets yet, go to the **Pets** section first

### Step 4: Enter Doctor Information
**Doctor Details:**
- **Doctor Name*** (Required): Enter the veterinarian's name
  - Example: "Dr. Sharma" or "Dr. Patel"
  
- **Clinic / Hospital** (Optional): Enter the clinic or hospital name
  - Example: "City Pet Hospital" or "Animal Care Center"
  
- **Doctor Phone** (Optional): Enter the doctor's contact number
  - Example: "+91-9876543210" or "011-40123456"
  
- **Doctor Specialty** (Optional): Doctor's specialty field
  - Examples: "General", "Surgery", "Cardiology", "Dentistry", "Emergency"
  
- **Doctor Profile Picture URL** (Optional): Add doctor's profile photo
  - Paste the URL of a doctor image (JPG, PNG, etc.)
  - Example: "https://example.com/doctor-photo.jpg"
  - This image will display as a circular avatar (80x80px) with animations

### Step 5: Set Appointment Date & Time
**Appointment Timing:**
- **Date of Appointment*** (Required): Select the date from the date picker
  - Only future dates can be selected
  - Format: YYYY-MM-DD
  
- **Time of Appointment*** (Required): Enter the appointment time
  - Format: HH:MM (24-hour format)
  - Example: "14:30" for 2:30 PM

### Step 6: Describe the Reason for Visit
**Reason for Visit*** (Required): Provide details about the visit
- Examples:
  - "Regular health checkup and vaccination update"
  - "Treatment for ear infection"
  - "Post-surgery follow-up examination"
  - "Dental cleaning and scaling"
  - "Emergency: Limping and unable to walk"

### Step 7: Add Optional Notes
**Additional Notes** (Optional): Any extra information
- Medication allergies
- Previous medical history relevant to this visit
- Special requests or preferences
- Behavioral notes

### Step 8: Review Appointment Details
Before submitting, verify:
- ✓ Pet is selected
- ✓ Doctor name is filled
- ✓ Date and time are set
- ✓ Reason for visit is described
- ✓ All required fields are complete

### Step 9: Submit the Appointment
- Click the **"✓ Book Appointment"** button
- The form will submit and you'll see a success message
- The appointment will be added to your list below the form

---

## 💳 Payment Processing

### Understanding Appointment Fees
- **Default Fee**: ₹500 per appointment
- This fee covers the veterinarian's consultation and basic services
- Additional procedures may have separate charges

### Payment Status Options
After booking, your appointment will have one of these payment statuses:

| Status | Description | Action |
|--------|-------------|--------|
| **Pending** ⏳ | Payment not yet initiated | Pay Now button is active |
| **Initiated** 🔄 | Payment process started | Waiting for completion |
| **Completed** ✅ | Payment successful | Appointment confirmed |
| **Failed** ❌ | Payment failed | Try paying again |
| **Cancelled** ⚫ | Payment cancelled by user | Book new appointment |

### Making a Payment via Razorpay

#### When Payment Status is "Pending":
1. Look for the **💳 Pay Now** button on the appointment card
2. Click the **Pay Now** button
3. The Razorpay payment gateway will open
4. Select your payment method:
   - Credit Card
   - Debit Card
   - UPI
   - Wallet
   - Net Banking

#### During Payment:
- Enter payment details as required
- The payment is secure and encrypted
- You'll receive an transaction ID for your records
- Payment confirmation will appear on screen

#### After Payment:
- Status changes to **"Completed"** ✅
- Your appointment is now confirmed
- You'll receive a confirmation notification
- An email confirmation will be sent to your registered email

### Payment Columns in Appointment List
When viewing your appointments, you'll see:
- **Fee**: Appointment cost (₹500 by default)
- **Payment Status**: Current payment status with color coding
- **Payment Method**: How the payment was made (Razorpay, Wallet, Cash)

---

## 📅 Managing Your Appointments

### View Appointments
1. All your appointments are displayed in a grid below the form
2. Each appointment shows:
   - **Pet Name** with animal emoji
   - **Doctor Information** with profile picture and contact details
   - **Appointment Date & Time**
   - **Reason for Visit**
   - **Additional Notes** (if any)
   - **Payment Information** with fee and payment status
   - **Status Badge** (Scheduled, Completed, Cancelled)

### Filter Appointments
Use the filter buttons at the top of the appointments list:
- **All**: Show all appointments
- **Scheduled**: Upcoming appointments
- **Completed**: Past appointments
- **Cancelled**: Cancelled appointments

### Edit an Appointment
1. Click the **✏️ Edit** button on any appointment card
2. The form will populate with the appointment details
3. Make your changes
4. Click **"💾 Update Appointment"** button
5. Changes are saved immediately

### Delete an Appointment
1. Click the **🗑️ Delete** button on any appointment card
2. A confirmation dialog will appear
3. Confirm the deletion
4. The appointment is removed from your list

### Cancel Payment
- If you need to cancel a pending payment:
  1. Delete the appointment (this cancels the booking)
  2. Book a new appointment later if needed

---

## 👨‍⚕️ Doctor Profile Display

### Doctor Card Features
- **Profile Picture**: Circular avatar with subtle pulse animation (80x80px)
- **Doctor Name**: Full name with doctor emoji (👨‍⚕️)
- **Contact Number**: Phone number with phone emoji (📞)
- **Specialty**: Medical specialty with tag emoji (🏷️)
- **Clinic Name**: Associated clinic or hospital

### Doctor Information Animation
- Profile pictures have a subtle scaling animation
- Information cards slide in smoothly when loading
- Hover effects provide visual feedback
- Color-coded styling for easy identification

---

## 🔐 Security & Privacy

### Payment Security
- All payments are processed through Razorpay (PCI-DSS certified)
- Your card details are never stored in our system
- End-to-end encryption for all transactions
- SSL/TLS protocol for secure communication

### Data Privacy
- Your appointment details are private
- Doctor information is stored securely
- Medical information is encrypted
- Only you can view or modify your appointments

---

## ⚠️ Important Notes

### Before Booking
- Ensure your pet is registered in the system
- Have the doctor's information ready
- Choose a suitable date and time
- Write a detailed reason for the visit

### After Booking
- You'll receive appointment confirmations
- Payment must be completed for confirmation
- Arrive 10-15 minutes before scheduled time
- Bring required documents (vaccination records, etc.)

### If Issues Occur
- **Payment Failed**: Try again or use different payment method
- **Appointment Not Showing**: Refresh the page or logout/login
- **Can't Edit**: Appointment may have passed or been completed
- **Contact Support**: Reach out if problems persist

---

## 🎯 Best Practices

### For Better Experience
✓ Book appointments at least 2-3 days in advance  
✓ Add complete doctor information for better records  
✓ Include detailed reason for visit  
✓ Complete payment immediately after booking  
✓ Keep track of payment confirmations  
✓ Update appointment details if plans change  

### Common Reasons for Visit
- Regular health checkup
- Vaccination updates
- Disease/injury treatment
- Dental care
- Grooming assessment
- Behavioral consultation
- Post-operative follow-up
- Emergency care

---

## 📞 Support & Help

### Getting Help
- Check this guide for common questions
- Review appointment details before submitting
- Verify all information is correct
- Contact support for technical issues
- Call the clinic directly for medical questions

### Frequently Asked Questions

**Q: Can I book multiple appointments for the same day?**
A: Yes, you can book different time slots or multiple pets

**Q: What if I need to cancel an appointment?**
A: Click Delete on the appointment card, then rebook if needed

**Q: Is the payment mandatory?**
A: Yes, payment confirms your appointment

**Q: Can I edit appointment after paying?**
A: Yes, but payment status remains the same

**Q: What payment methods are accepted?**
A: All major credit/debit cards, UPI, wallets, and net banking

---

## 🎉 Success Tips

1. **Complete Registration**: Ensure all pet details are added
2. **Accurate Information**: Double-check dates and doctor details
3. **Quick Payment**: Complete payment immediately for confirmation
4. **Keep Records**: Save confirmation emails and payment receipts
5. **Timely Action**: Book appointments in advance for better slots

---

**Last Updated**: 2024
**Version**: 1.0

For more information, visit the Pet Care Application Help Center or contact support.
