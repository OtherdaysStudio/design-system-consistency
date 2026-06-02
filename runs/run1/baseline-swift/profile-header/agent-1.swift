import SwiftUI

/// A polished profile header row for the "Aperture" iOS app.
///
/// Layout: circular avatar on the left, a vertical block with the person's
/// name and their role plus a small neutral "Pro" badge, and a primary
/// "Follow" button on the trailing edge. Everything is vertically centered.
struct ProfileHeader: View {
    var name: String = "Jordan Avery"
    var role: String = "Product Designer"
    var avatarSystemImage: String = "person.fill"
    var isFollowing: Bool = false

    @State private var following: Bool

    init(
        name: String = "Jordan Avery",
        role: String = "Product Designer",
        avatarSystemImage: String = "person.fill",
        isFollowing: Bool = false
    ) {
        self.name = name
        self.role = role
        self.avatarSystemImage = avatarSystemImage
        self.isFollowing = isFollowing
        _following = State(initialValue: isFollowing)
    }

    var body: some View {
        HStack(spacing: 14) {
            avatar

            VStack(alignment: .leading, spacing: 3) {
                Text(name)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.primary)
                    .lineLimit(1)

                HStack(spacing: 8) {
                    Text(role)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)

                    ProBadge()
                }
            }
            .layoutPriority(1)

            Spacer(minLength: 12)

            followButton
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Avatar

    private var avatar: some View {
        Image(systemName: avatarSystemImage)
            .font(.system(size: 22, weight: .medium))
            .foregroundStyle(.white)
            .frame(width: 52, height: 52)
            .background(
                LinearGradient(
                    colors: [Color.accentColor, Color.accentColor.opacity(0.7)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .clipShape(Circle())
            .overlay(
                Circle()
                    .strokeBorder(Color.primary.opacity(0.06), lineWidth: 1)
            )
    }

    // MARK: - Follow button

    private var followButton: some View {
        Button {
            withAnimation(.snappy(duration: 0.2)) {
                following.toggle()
            }
        } label: {
            Text(following ? "Following" : "Follow")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(following ? Color.accentColor : Color.white)
                .padding(.horizontal, 18)
                .padding(.vertical, 9)
                .background {
                    if following {
                        Capsule()
                            .fill(Color.accentColor.opacity(0.12))
                    } else {
                        Capsule()
                            .fill(Color.accentColor)
                    }
                }
                .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .animation(.snappy(duration: 0.2), value: following)
    }
}

// MARK: - Pro Badge

private struct ProBadge: View {
    var body: some View {
        Text("Pro")
            .font(.caption2.weight(.semibold))
            .textCase(.uppercase)
            .tracking(0.5)
            .foregroundStyle(.secondary)
            .padding(.horizontal, 7)
            .padding(.vertical, 2)
            .background(
                Capsule()
                    .fill(Color.primary.opacity(0.07))
            )
            .overlay(
                Capsule()
                    .strokeBorder(Color.primary.opacity(0.06), lineWidth: 0.5)
            )
            .fixedSize()
    }
}

// MARK: - Preview

#Preview("Profile Header") {
    VStack(spacing: 0) {
        ProfileHeader()
        Divider().padding(.leading, 16)
        ProfileHeader(
            name: "Sam Rivera",
            role: "Product Designer",
            isFollowing: true
        )
    }
    .background(Color(.systemBackground))
}

#Preview("Profile Header • Dark") {
    ProfileHeader()
        .preferredColorScheme(.dark)
}
