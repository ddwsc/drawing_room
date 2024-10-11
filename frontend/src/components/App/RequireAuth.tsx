import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { routes } from "@/constants";

interface Prop {
	children?: React.ReactNode;
}

export function RequireAuth({ children }: Prop) {
	const { email } = useAuth();
	const location = useLocation();

	if (!email) {
		return <Navigate to={routes.signIn} state={{ from: location }} replace />;
	}
	return children ? children : <Outlet />;
}
