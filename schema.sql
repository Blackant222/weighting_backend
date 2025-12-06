-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  country VARCHAR(100) NOT NULL,
  goal_weight DECIMAL(5,2),
  goal_rationale TEXT,
  activity_level VARCHAR(50),
  dietary_preferences TEXT[],
  allergies TEXT[],
  meals_per_day VARCHAR(20),
  primary_goal VARCHAR(50),
  streak INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Diet Plans Table
CREATE TABLE diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week INTEGER NOT NULL,
  body_composition JSONB,
  health_insights TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Daily Plans Table
CREATE TABLE daily_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_plan_id UUID REFERENCES diet_plans(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  title VARCHAR(255),
  total_calories INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Meals Table
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_plan_id UUID REFERENCES daily_plans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  ingredients TEXT[],
  instructions TEXT[],
  prep_time VARCHAR(50),
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fats DECIMAL(5,2),
  completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Chat Messages Table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Check-ins Table
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  diet_plan_id UUID REFERENCES diet_plans(id),
  week INTEGER NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  mood INTEGER,
  feedback TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own plans" ON diet_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans" ON diet_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON diet_plans FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own daily plans" ON daily_plans FOR SELECT USING (EXISTS (SELECT 1 FROM diet_plans WHERE diet_plans.id = daily_plans.diet_plan_id AND diet_plans.user_id = auth.uid()));
CREATE POLICY "Users can insert own daily plans" ON daily_plans FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM diet_plans WHERE diet_plans.id = daily_plans.diet_plan_id AND diet_plans.user_id = auth.uid()));
CREATE POLICY "Users can update own daily plans" ON daily_plans FOR UPDATE USING (EXISTS (SELECT 1 FROM diet_plans WHERE diet_plans.id = daily_plans.diet_plan_id AND diet_plans.user_id = auth.uid()));

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own meals" ON meals FOR SELECT USING (EXISTS (SELECT 1 FROM daily_plans JOIN diet_plans ON diet_plans.id = daily_plans.diet_plan_id WHERE daily_plans.id = meals.daily_plan_id AND diet_plans.user_id = auth.uid()));
CREATE POLICY "Users can insert own meals" ON meals FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM daily_plans JOIN diet_plans ON diet_plans.id = daily_plans.diet_plan_id WHERE daily_plans.id = meals.daily_plan_id AND diet_plans.user_id = auth.uid()));
CREATE POLICY "Users can update own meals" ON meals FOR UPDATE USING (EXISTS (SELECT 1 FROM daily_plans JOIN diet_plans ON diet_plans.id = daily_plans.diet_plan_id WHERE daily_plans.id = meals.daily_plan_id AND diet_plans.user_id = auth.uid()));

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON chat_messages FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own check-ins" ON check_ins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own check-ins" ON check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_diet_plans_user_id ON diet_plans(user_id);
CREATE INDEX idx_diet_plans_active ON diet_plans(user_id, is_active);
CREATE INDEX idx_daily_plans_diet_plan_id ON daily_plans(diet_plan_id);
CREATE INDEX idx_meals_daily_plan_id ON meals(daily_plan_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_check_ins_user_id ON check_ins(user_id);
