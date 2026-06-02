import SwiftUI

/// A polished profile header row for the Aperture iOS app.
///
/// Layout: circular avatar on the left, a vertical block with the person's
/// name and role (plus a "Pro" badge), and a primary "Follow" button on the
/// right. Everything is laid out horizontally and vertically centered.
struct ProfileHeader: View {
    var name: String = "Maya Okafor"
    var role: String = "Product Designer"
    var avatarImageName: String? = nil
    var isPro: Bool = true
    @State private var isFollowing: Bool = false

    var body: some View {
        HStack(spacing: 14) {
            avatar

            VStack(alignment: .leading, spacing: 3) {
                Text(name)
                    .font(.system(.headline, design: .rounded).weight(.semibold))
                    .foregroundStyle(.primary)
                    .lineLimit(1)

                HStack(spacing: 6) {
                    Text(role)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)

                    if isPro {
                        proBadge
                    }
                }
            }
            .layoutPriority(1)

            Spacer(minLength: 12)

            followButton
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 16)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(.background)
                .shadow(color: .black.opacity(0.06), radius: 10, x: 0, y: 4)
        )
    }

    // MARK: - Avatar

    private var avatar: some View {
        Group {
            if let avatarImageName {
                Image(avatarImageName)
                    .resizable()
                    .scaledToFill()
            } else {
                initialsPlaceholder
            }
        }
        .frame(width: 52, height: 52)
        .clipShape(Circle())
        .overlay(
            Circle()
                .strokeBorder(.white.opacity(0.7), lineWidth: 0.5)
        )
        .overlay(
            Circle()
                .stroke(Color.primary.opacity(0.06), lineWidth: 1)
        )
    }

    private var initialsPlaceholder: some View {
        LinearGradient(
            colors: [Color(.systemIndigo), Color(.systemPurple)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .overlay(
            Text(initials)
                .font(.system(size: 20, weight: .semibold, design: .rounded))
                .foregroundStyle(.white)
        )
    }

    private var initials: String {
        let parts = name
            .split(separator: " ")
            .prefix(2)
            .compactMap { $0.first.map(String.init) }
        return parts.joined().uppercased()
    }

    // MARK: - Pro Badge

    private var proBadge: some View {
        Text("Pro")
            .font(.system(size: 11, weight: .semibold, design: .rounded))
            .foregroundStyle(.secondary)
            .padding(.horizontal, 7)
            .padding(.vertical, 2)
            .background(
                Capsule(style: .continuous)
                    .fill(Color.primary.opacity(0.07))
            )
            .overlay(
                Capsule(style: .continuous)
                    .strokeBorder(Color.primary.opacity(0.08), lineWidth: 0.5)
            )
            .fixedSize()
    }

    // MARK: - Follow Button

    private var followButton: some View {
        Button {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                isFollowing.toggle()
            }
        } label: {
            Text(isFollowing ? "Following" : "Follow")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(isFollowing ? Color.accentColor : .white)
                .padding(.horizontal, 18)
                .padding(.vertical, 9)
                .background(
                    Capsule(style: .continuous)
                        .fill(isFollowing ? AnyShapeStyle(Color.accentColor.opacity(0.12))
                                          : AnyShapeStyle(Color.accentColor))
                )
                .overlay(
                    Capsule(style: .continuous)
                        .strokeBorder(Color.accentColor.opacity(isFollowing ? 0.25 : 0), lineWidth: 1)
                )
                .contentShape(Capsule(style: .continuous))
        }
        .buttonStyle(.plain)
        .fixedSize()
    }
}

// MARK: - Preview

#Preview {
    VStack(spacing: 16) {
        ProfileHeader()
        ProfileHeader(name: "Jonah Reyes", role: "iOS Engineer", isPro: false)
    }
    .padding()
    .background(Color(.systemGroupedBackground))
}
