import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { GoalForm } from '../components/goals/GoalForm';
import { GoalOverview } from '../components/goals/GoalOverview';
import { GoalAnalysis } from '../components/goals/GoalAnalysis';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    fetchGoalAnalysis,
} from '../store/slices/goalSlice';

export const Goals: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading: isAuthLoading } = useProtectedRoute();
    const [showForm, setShowForm] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const {
        goals,
        analysis,
        isLoading,
        error
    } = useAppSelector((state) => state.goals);

    const { monthlyIncome, savingsCapacity } = useAppSelector(
        (state) => state.user.dashboard || { monthlyIncome: 0, savingsCapacity: 0 }
    );

    useEffect(() => {
        dispatch(fetchGoals());
        dispatch(fetchGoalAnalysis());
    }, [dispatch]);

    const handleAddGoal = () => {
        setSelectedGoal(null);
        setShowForm(true);
    };

    const handleEditGoal = (goal) => {
        setSelectedGoal(goal);
        setShowForm(true);
    };

    const handleDeleteGoal = async (id) => {
        await dispatch(deleteGoal(id));
        dispatch(fetchGoals());
        dispatch(fetchGoalAnalysis());
    };

    const handleSubmitGoal = async (values) => {
        if (selectedGoal) {
            await dispatch(updateGoal({ id: selectedGoal.id, ...values }));
        } else {
            await dispatch(createGoal(values));
        }
        setShowForm(false);
        dispatch(fetchGoals());
        dispatch(fetchGoalAnalysis());
    };

    if (isAuthLoading || isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h5" color="error">
                    Error: {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4">
                        Financial Goals Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddGoal}
                    >
                        Add Goal
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {/* Goals Overview */}
                    <Grid item xs={12}>
                        <GoalOverview
                            summary={{
                                totalGoals: goals.length,
                                totalTargetAmount: goals.reduce((sum, goal) => sum + goal.targetAmount, 0),
                                totalCurrentAmount: goals.reduce((sum, goal) => sum + goal.currentAmount, 0),
                                averageProgress: goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount * 100), 0) / goals.length,
                                onTrackCount: goals.filter(goal => goal.isOnTrack).length,
                                atRiskCount: goals.filter(goal => !goal.isOnTrack).length
                            }}
                            goals={goals}
                            trends={analysis.trends}
                            monthlyIncome={monthlyIncome}
                            onEditGoal={handleEditGoal}
                            onDeleteGoal={handleDeleteGoal}
                        />
                    </Grid>

                    {/* Goal Analysis */}
                    <Grid item xs={12}>
                        <GoalAnalysis
                            metrics={analysis.metrics}
                            riskFactors={analysis.riskFactors}
                            adjustments={analysis.adjustments}
                            monthlyIncome={monthlyIncome}
                            savingsCapacity={savingsCapacity}
                            projections={analysis.projections}
                        />
                    </Grid>
                </Grid>

                {showForm && (
                    <GoalForm
                        open={showForm}
                        onClose={() => setShowForm(false)}
                        onSubmit={handleSubmitGoal}
                        initialValues={selectedGoal}
                        isEditing={!!selectedGoal}
                        monthlyIncome={monthlyIncome}
                    />
                )}
            </Box>
        </Container>
    );
}; 