import React from 'react';
import {Pressable, StyleSheet, Text, PressableProps, useColorScheme} from 'react-native';
import {useThemeColor} from "@/hooks/useThemeColor";

export type ThemedButtonProps = PressableProps & {
    variant?: 'outlined' | 'contained' | 'text';
    children: string;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({variant = 'outlined', onPress, children, disabled, ...rest}) => {
    const themeButtonColor = useThemeColor({}, 'buttonMain');
    const themeTextColor = useThemeColor({}, 'text');

    const getButtonStyle = () => {
        switch (variant) {
            case 'outlined':
            default:
                return styles.variantOutlined;
            case 'contained':
                return styles.variantContained;
            case 'text':
                return styles.variantText;
        }
    };

    return (
        <Pressable
            style={({pressed}) => [getButtonStyle(), pressed && styles.pressed, variant == 'contained' && {backgroundColor: themeButtonColor}, variant == 'outlined' && {borderColor: themeTextColor}, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            {...rest}
        >
            <Text style={[{color: themeTextColor, textAlign: 'center'}, styles.buttonText]}>{children.toUpperCase()}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pressed: {
        opacity: 0.6,
    },
    variantOutlined: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    variantContained: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    variantText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.5,
    }
});
