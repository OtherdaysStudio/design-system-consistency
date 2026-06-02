// AUTO-GENERATED from reference/design-system.json — do not edit by hand.
import SwiftUI

public enum DS {
    public enum Spacing {
        public static let none: CGFloat = 0
        public static let xs: CGFloat = 4
        public static let sm: CGFloat = 8
        public static let md: CGFloat = 16
        public static let lg: CGFloat = 24
        public static let xl: CGFloat = 32
        public static let xxl: CGFloat = 48
        public static let xxxl: CGFloat = 64
    }
    public enum Radius {
        public static let sm: CGFloat = 6
        public static let md: CGFloat = 10
        public static let lg: CGFloat = 16
        public static let pill: CGFloat = 999
    }
    public enum FontSize {
        public static let xs: CGFloat = 12
        public static let sm: CGFloat = 14
        public static let md: CGFloat = 16
        public static let lg: CGFloat = 20
        public static let xl: CGFloat = 28
        public static let xxl: CGFloat = 36
    }
    public enum BorderWidth {
        public static let thin: CGFloat = 1
        public static let thick: CGFloat = 2
    }
    public enum Size {
        public static let controlSm: CGFloat = 32
        public static let controlMd: CGFloat = 40
        public static let controlLg: CGFloat = 48
        public static let iconSm: CGFloat = 16
        public static let iconMd: CGFloat = 20
        public static let iconLg: CGFloat = 24
    }
}

public extension Color {
    static let dsBgCanvas = Color(red: 0.965, green: 0.969, blue: 0.976)  // color.bg.canvas
    static let dsBgSurface = Color(red: 1.000, green: 1.000, blue: 1.000)  // color.bg.surface
    static let dsBgMuted = Color(red: 0.925, green: 0.933, blue: 0.949)  // color.bg.muted
    static let dsBgInverse = Color(red: 0.090, green: 0.106, blue: 0.137)  // color.bg.inverse
    static let dsTextPrimary = Color(red: 0.090, green: 0.106, blue: 0.137)  // color.text.primary
    static let dsTextSecondary = Color(red: 0.369, green: 0.400, blue: 0.459)  // color.text.secondary
    static let dsTextMuted = Color(red: 0.592, green: 0.631, blue: 0.698)  // color.text.muted
    static let dsTextOnAction = Color(red: 1.000, green: 1.000, blue: 1.000)  // color.text.onAction
    static let dsActionPrimary = Color(red: 0.184, green: 0.427, blue: 0.965)  // color.action.primary
    static let dsActionPrimaryHover = Color(red: 0.122, green: 0.341, blue: 0.839)  // color.action.primaryHover
    static let dsActionSecondary = Color(red: 0.925, green: 0.933, blue: 0.949)  // color.action.secondary
    static let dsActionSecondaryHover = Color(red: 0.867, green: 0.882, blue: 0.910)  // color.action.secondaryHover
    static let dsActionDanger = Color(red: 0.788, green: 0.231, blue: 0.251)  // color.action.danger
    static let dsActionDangerHover = Color(red: 0.788, green: 0.231, blue: 0.251)  // color.action.dangerHover
    static let dsBorderDefault = Color(red: 0.867, green: 0.882, blue: 0.910)  // color.border.default
    static let dsBorderStrong = Color(red: 0.757, green: 0.784, blue: 0.831)  // color.border.strong
    static let dsBorderFocus = Color(red: 0.184, green: 0.427, blue: 0.965)  // color.border.focus
    static let dsStatusSuccess = Color(red: 0.102, green: 0.529, blue: 0.329)  // color.status.success
    static let dsStatusSuccessBg = Color(red: 0.902, green: 0.965, blue: 0.933)  // color.status.successBg
    static let dsStatusWarning = Color(red: 0.604, green: 0.384, blue: 0.000)  // color.status.warning
    static let dsStatusWarningBg = Color(red: 0.992, green: 0.945, blue: 0.863)  // color.status.warningBg
    static let dsStatusDanger = Color(red: 0.898, green: 0.282, blue: 0.302)  // color.status.danger
    static let dsStatusDangerBg = Color(red: 0.992, green: 0.918, blue: 0.918)  // color.status.dangerBg
    static let dsStatusInfo = Color(red: 0.184, green: 0.427, blue: 0.965)  // color.status.info
    static let dsStatusInfoBg = Color(red: 0.906, green: 0.937, blue: 1.000)  // color.status.infoBg
}

public extension Font {
    static let dsDisplay = Font.system(size: 36, weight: .bold)
    static let dsHeading = Font.system(size: 28, weight: .semibold)
    static let dsTitle = Font.system(size: 20, weight: .semibold)
    static let dsBody = Font.system(size: 16, weight: .regular)
    static let dsLabel = Font.system(size: 14, weight: .medium)
    static let dsCaption = Font.system(size: 12, weight: .regular)
}

public enum DSTypePreset { case display, heading, title, body, label, caption }
public extension View {
    func dsType(_ p: DSTypePreset) -> some View {
        let f: Font = switch p {
            case .display: .dsDisplay; case .heading: .dsHeading; case .title: .dsTitle;
            case .body: .dsBody; case .label: .dsLabel; case .caption: .dsCaption }
        return self.font(f)
    }
}
