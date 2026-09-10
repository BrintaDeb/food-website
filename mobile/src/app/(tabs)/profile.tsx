import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  SafeAreaView
} from 'react-native';
import {
  User,
  Phone,
  MapPin,
  Plus,
  LogOut,
  ShieldCheck,
  Headphones,
  Award
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/useAuthStore';
import { RESTAURANT_METADATA } from '@/constants/config';
import { COLORS, SHADOWS } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, loginWithPhone, logout, addAddress } = useAuthStore();
  const [newAddress, setNewAddress] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleSaveAddress = () => {
    if (!newAddress.trim()) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    addAddress(newAddress.trim());
    setNewAddress('');
    setIsAddingAddress(false);
  };

  const handleSaveProfile = () => {
    if (!phoneInput.trim()) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    loginWithPhone(phoneInput.trim(), nameInput.trim() || 'Gourmet Patron');
    setIsEditingProfile(false);
  };

  const handleCallSupport = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    Linking.openURL(`tel:${RESTAURANT_METADATA.phone.replace(/[^0-9+]/g, '')}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guest & Account Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={[styles.userCard, SHADOWS.card]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👑</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Gourmet Guest'}</Text>
            <View style={styles.phoneRow}>
              <Phone size={12} color={COLORS.muted} />
              <Text style={styles.userPhone}>{user?.phone || '+91 98765 43210'}</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsEditingProfile(!isEditingProfile)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {isEditingProfile ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Edit Form */}
        {isEditingProfile && (
          <View style={[styles.sectionBox, SHADOWS.card]}>
            <Text style={styles.sectionHeading}>Update Profile</Text>
            <TextInput
              placeholder="Your Full Name"
              value={nameInput}
              onChangeText={setNameInput}
              style={styles.textInput}
            />
            <TextInput
              placeholder="10-digit Mobile Number"
              keyboardType="phone-pad"
              value={phoneInput}
              onChangeText={setPhoneInput}
              style={[styles.textInput, { marginTop: 8 }]}
            />
            <TouchableOpacity
              onPress={handleSaveProfile}
              style={styles.savePrimaryButton}
            >
              <Text style={styles.savePrimaryButtonText}>Save Details</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Saved Addresses Section */}
        <View style={[styles.sectionBox, SHADOWS.card]}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.iconHeadingRow}>
              <MapPin size={18} color={COLORS.primary} />
              <Text style={styles.sectionHeading}>Saved Delivery Addresses</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsAddingAddress(!isAddingAddress)}
              style={styles.addAddressTrigger}
            >
              <Plus size={14} color={COLORS.primary} />
              <Text style={styles.addAddressTriggerText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {isAddingAddress && (
            <View style={styles.addAddressBox}>
              <TextInput
                placeholder="e.g. Flat 302, Palm Grove, Park Street, Kolkata"
                value={newAddress}
                onChangeText={setNewAddress}
                multiline
                style={styles.textInputMultiline}
              />
              <TouchableOpacity
                onPress={handleSaveAddress}
                style={styles.savePrimaryButton}
              >
                <Text style={styles.savePrimaryButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.addressList}>
            {(user?.addresses || []).map((addr, idx) => (
              <View key={idx} style={styles.addressItem}>
                <View style={styles.addressDot} />
                <Text style={styles.addressText}>{addr}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Royal Dining Privilege Badges */}
        <View style={[styles.sectionBox, SHADOWS.card]}>
          <View style={styles.iconHeadingRow}>
            <Award size={18} color={COLORS.starAmber} />
            <Text style={styles.sectionHeading}>Culinary Privileges</Text>
          </View>
          <View style={styles.privilegeRow}>
            <View style={styles.privilegeItem}>
              <Text style={styles.privilegeNumber}>50%</Text>
              <Text style={styles.privilegeText}>Code ROYAL50</Text>
            </View>
            <View style={styles.privilegeItem}>
              <Text style={styles.privilegeNumber}>0₹</Text>
              <Text style={styles.privilegeText}>Free Delivery &gt;₹500</Text>
            </View>
            <View style={styles.privilegeItem}>
              <Text style={styles.privilegeNumber}>GPS</Text>
              <Text style={styles.privilegeText}>Live Map Courier</Text>
            </View>
          </View>
        </View>

        {/* Support Hotline */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCallSupport}
          style={[styles.supportButton, SHADOWS.card]}
        >
          <Headphones size={20} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.supportTitle}>Kitchen Support & Concierge</Text>
            <Text style={styles.supportPhone}>{RESTAURANT_METADATA.phone}</Text>
          </View>
          <Text style={styles.supportCallText}>Call Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarEmoji: {
    fontSize: 26
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  userPhone: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '600'
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.surface
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  sectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  iconHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  addAddressTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  addAddressTriggerText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '800'
  },
  addAddressBox: {
    marginBottom: 14,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 16
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.charcoal
  },
  textInputMultiline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.charcoal,
    minHeight: 60,
    textAlignVertical: 'top'
  },
  savePrimaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  savePrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  addressList: {
    gap: 10
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 14,
    gap: 8
  },
  addressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 6
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontWeight: '600'
  },
  privilegeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4
  },
  privilegeItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center'
  },
  privilegeNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary
  },
  privilegeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.muted,
    marginTop: 2,
    textAlign: 'center'
  },
  supportButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  supportPhone: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '600',
    marginTop: 2
  },
  supportCallText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary
  }
});
