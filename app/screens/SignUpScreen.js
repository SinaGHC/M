import React, { useState } from "react";
import * as Yup from "yup";
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppTextInput from "../components/AppTextInput";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { Formik } from "formik";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  fullName: Yup.string().required("Full name is required"),
});

const SignUpScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    fullName: "",
  };

  const handleSubmit = async (values) => {
    setVisible(true);
    const { email, password, fullName } = values;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName,
      });

      console.log("Sign-up successful:", user);
    } catch (error) {
      console.error("Sign-up error:", error);
    } finally {
      setVisible(false);
    }
  };
  return (
    <Screen style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.DARK} />
      <View style={styles.formContainer}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 70, color: colors.LIGHT, marginBottom: 30 }}>
            M
          </Text>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <AppTextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
              <AppTextInput
                placeholder="Password"
                style={styles.input}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry
              />
              {errors.password && touched.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              <AppTextInput
                placeholder="Full Name"
                style={styles.input}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                value={values.fullName}
                autoCapitalize="words"
              />
              {errors.fullName && touched.fullName && (
                <Text style={styles.error}>{errors.fullName}</Text>
              )}
              <Pressable style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.text}>Submit</Text>
              </Pressable>
            </>
          )}
        </Formik>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Have an account?</Text>
          <Pressable
            disabled={visible}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={[styles.bottomText, styles.link]}> Login</Text>
          </Pressable>
        </View>
        {visible && <ActivityIndicator />}
      </View>
    </Screen>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.DARK,
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 40,
  },
  btn: {
    backgroundColor: colors.LIGHT,
    width: "100%",
    borderRadius: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: colors.DARK,
  },
  error: {
    color: "red",
    marginBottom: 10,
    top: -20,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  bottomText: {
    color: colors.LIGHT,
    fontSize: 16,
  },
  link: {
    textDecorationLine: "underline",
    marginLeft: 5,
  },
  formContainer: {
    top: 80,
  },
});
