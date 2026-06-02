import SwiftUI

/// A polished, production-quality toast notification for the Aperture iOS app.
///
/// Layout: a success badge on the leading edge, a stacked title + body block in
/// the middle, and a ghost "Undo" action on the trailing edge — all on an
/// elevated surface in a single horizontal row.
struct NotificationToast: View {

    // MARK: Configuration

    var title: String = "Saved"
    var message: String = "Your changes were published."
    var actionTitle: String = "Undo"
    var onAction: () -> Void = {}

    // MARK: Tokens

    private enum Metrics {
        static let cornerRadius: CGFloat = 18
        static let horizontalPadding: CGFloat = 16
        static let verticalPadding: CGFloat = 14
        static let contentSpacing: CGFloat = 13
        static let badgeSize: CGFloat = 30
        static let textSpacing: CGFloat = 2
    }

    private enum Palette {
        static let success = Color(red: 0.13, green: 0.73, blue: 0.45)
        static let title = Color.primary
        static let body = Color.secondary
        static let accent = Color(red: 0.24, green: 0.52, blue: 0.96)
    }

    // MARK: Body

    var body: some View {
        HStack(spacing: Metrics.contentSpacing) {
            successBadge

            VStack(alignment: .leading, spacing: Metrics.textSpacing) {
                Text(title)
                    .font(.system(.subheadline, design: .rounded).weight(.semibold))
                    .foregroundStyle(Palette.title)
                    .fixedSize(horizontal: false, vertical: true)

                Text(message)
                    .font(.system(.footnote))
                    .foregroundStyle(Palette.body)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer(minLength: Metrics.contentSpacing)

            undoButton
        }
        .padding(.horizontal, Metrics.horizontalPadding)
        .padding(.vertical, Metrics.verticalPadding)
        .background(surface)
        .overlay(hairline)
        .clipShape(RoundedRectangle(cornerRadius: Metrics.cornerRadius, style: .continuous))
        .shadow(color: .black.opacity(0.16), radius: 24, x: 0, y: 12)
        .shadow(color: .black.opacity(0.06), radius: 2, x: 0, y: 1)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(title). \(message)")
    }

    // MARK: Components

    private var successBadge: some View {
        ZStack {
            Circle()
                .fill(Palette.success.opacity(0.16))

            Image(systemName: "checkmark")
                .font(.system(size: 13, weight: .bold, design: .rounded))
                .foregroundStyle(Palette.success)
        }
        .frame(width: Metrics.badgeSize, height: Metrics.badgeSize)
        .accessibilityHidden(true)
    }

    private var undoButton: some View {
        Button(action: onAction) {
            Text(actionTitle)
                .font(.system(.subheadline, design: .rounded).weight(.semibold))
                .foregroundStyle(Palette.accent)
                .padding(.horizontal, 12)
                .padding(.vertical, 7)
                .contentShape(Rectangle())
        }
        .buttonStyle(GhostButtonStyle())
        .accessibilityLabel(actionTitle)
        .accessibilityHint("Reverts the last change")
    }

    private var surface: some View {
        RoundedRectangle(cornerRadius: Metrics.cornerRadius, style: .continuous)
            .fill(.regularMaterial)
    }

    private var hairline: some View {
        RoundedRectangle(cornerRadius: Metrics.cornerRadius, style: .continuous)
            .strokeBorder(Color.primary.opacity(0.06), lineWidth: 0.75)
    }
}

/// A subtle ghost button: no fill at rest, a faint accent tint while pressed.
private struct GhostButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .fill(Color(red: 0.24, green: 0.52, blue: 0.96)
                        .opacity(configuration.isPressed ? 0.14 : 0))
            )
            .opacity(configuration.isPressed ? 0.85 : 1)
            .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
    }
}

// MARK: - Preview

#Preview("Notification Toast") {
    ZStack {
        LinearGradient(
            colors: [Color(red: 0.95, green: 0.96, blue: 0.98),
                     Color(red: 0.90, green: 0.92, blue: 0.96)],
            startPoint: .top,
            endPoint: .bottom
        )
        .ignoresSafeArea()

        NotificationToast(onAction: {})
            .padding(.horizontal, 20)
    }
}

#Preview("Dark") {
    ZStack {
        Color.black.ignoresSafeArea()

        NotificationToast(onAction: {})
            .padding(.horizontal, 20)
    }
    .preferredColorScheme(.dark)
}
