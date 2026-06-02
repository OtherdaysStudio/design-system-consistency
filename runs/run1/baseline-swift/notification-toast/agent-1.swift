import SwiftUI

/// A success toast notification for the Aperture iOS app.
///
/// Presents a confirmation that changes were published, with an inline
/// affordance to undo the action. Designed as an elevated, self-contained
/// surface that can be overlaid at the top or bottom of any screen.
struct NotificationToast: View {
    /// Title shown in bold at the top of the message.
    var title: String = "Saved"
    /// Supporting body line shown beneath the title.
    var message: String = "Your changes were published."
    /// Label for the trailing ghost action.
    var actionTitle: String = "Undo"
    /// Invoked when the trailing ghost action is tapped.
    var onUndo: () -> Void = {}

    var body: some View {
        HStack(spacing: 14) {
            SuccessBadge()

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline.weight(.bold))
                    .foregroundStyle(.primary)

                Text(message)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
            }
            .accessibilityElement(children: .combine)

            Spacer(minLength: 12)

            UndoButton(title: actionTitle, action: onUndo)
        }
        .padding(.vertical, 14)
        .padding(.leading, 16)
        .padding(.trailing, 12)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(.background)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.06), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .shadow(color: .black.opacity(0.18), radius: 24, x: 0, y: 12)
        .shadow(color: .black.opacity(0.06), radius: 1, x: 0, y: 1)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text("\(title). \(message)"))
    }
}

// MARK: - Success Badge

/// Circular success indicator with a centered checkmark.
private struct SuccessBadge: View {
    var body: some View {
        ZStack {
            Circle()
                .fill(Color.green.opacity(0.15))

            Image(systemName: "checkmark")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(Color.green)
        }
        .frame(width: 32, height: 32)
        .accessibilityHidden(true)
    }
}

// MARK: - Undo Button

/// A ghost (text-only) button with a subtle pressed state.
private struct UndoButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(Color.accentColor)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .contentShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
        .buttonStyle(GhostButtonStyle())
    }
}

/// Provides a tinted, scaled-down highlight while the ghost button is pressed.
private struct GhostButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .fill(Color.accentColor.opacity(configuration.isPressed ? 0.14 : 0))
            )
            .scaleEffect(configuration.isPressed ? 0.96 : 1)
            .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
    }
}

// MARK: - Preview

#Preview("Notification Toast") {
    ZStack {
        LinearGradient(
            colors: [Color(white: 0.96), Color(white: 0.90)],
            startPoint: .top,
            endPoint: .bottom
        )
        .ignoresSafeArea()

        VStack {
            NotificationToast()
                .padding(.horizontal, 20)
            Spacer()
        }
        .padding(.top, 24)
    }
}

#Preview("Dark") {
    ZStack {
        Color.black.ignoresSafeArea()

        NotificationToast()
            .padding(.horizontal, 20)
    }
    .preferredColorScheme(.dark)
}
