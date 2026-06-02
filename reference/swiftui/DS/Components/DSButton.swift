// Aperture DS — DSButton
// Triggers an action. NOT for navigation — use NavigationLink for that.
// Variant + size are Swift enums; all visual values come from DS.* / Color.ds*.
//
// Usage: DSButton("Save") { save() }.dsButtonStyle(.primary, .md)
//        DSButton("Delete") { delete() }.dsButtonStyle(.danger)
import SwiftUI

/// The labelled, action-triggering control. Pair with `.dsButtonStyle(_:_:)`.
public struct DSButton: View {
    private let title: String
    private let action: () -> Void

    public init(_ title: String, action: @escaping () -> Void) {
        self.title = title
        self.action = action
    }

    public var body: some View {
        Button(title, action: action)
    }
}

public struct DSButtonStyle: ButtonStyle {
    public enum Variant {
        case primary, secondary, danger, ghost
    }

    public enum Size {
        case sm, md, lg

        /// Control height — `size.control.*`.
        var height: CGFloat {
            switch self {
            case .sm: return DS.Size.controlSm
            case .md: return DS.Size.controlMd
            case .lg: return DS.Size.controlLg
            }
        }

        /// Typography preset for the label.
        var typePreset: DSTypePreset {
            switch self {
            case .sm: return .caption
            case .md: return .label
            case .lg: return .body
            }
        }
    }

    private let variant: Variant
    private let size: Size

    public init(_ variant: Variant = .primary, _ size: Size = .md) {
        self.variant = variant
        self.size = size
    }

    // MARK: Variant → tokens

    private var foreground: Color {
        switch variant {
        case .primary: return .dsTextOnAction   // button.fg.primary
        case .danger:  return .dsTextOnAction   // color.text.onAction
        case .secondary: return .dsTextPrimary  // color.text.primary
        case .ghost:   return .dsActionPrimary  // tinted label
        }
    }

    private func background(pressed: Bool) -> Color {
        switch variant {
        case .primary:
            return pressed ? .dsActionPrimaryHover : .dsActionPrimary
        case .danger:
            return pressed ? .dsActionDangerHover : .dsActionDanger
        case .secondary:
            return pressed ? .dsBgMuted : .dsActionSecondary
        case .ghost:
            return pressed ? .dsBgMuted : .clear
        }
    }

    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .dsType(size.typePreset)            // type.label
            .foregroundStyle(foreground)
            .padding(.horizontal, DS.Spacing.md) // button.paddingX
            .frame(height: size.height)          // size.control.*
            .frame(maxWidth: .infinity)
            .background(
                RoundedRectangle(cornerRadius: DS.Radius.md, style: .continuous) // button.radius
                    .fill(background(pressed: configuration.isPressed))
            )
            .contentShape(RoundedRectangle(cornerRadius: DS.Radius.md, style: .continuous))
            .opacity(configuration.isPressed ? 0.96 : 1)
    }
}

public extension View {
    /// Applies the Aperture button style. Variants/sizes are enums, never raw values.
    func dsButtonStyle(
        _ variant: DSButtonStyle.Variant = .primary,
        _ size: DSButtonStyle.Size = .md
    ) -> some View {
        buttonStyle(DSButtonStyle(variant, size))
    }
}
