import { StreamDefinition, SubjectGrade } from '../types';

export const ALGERIAN_STREAMS: StreamDefinition[] = [
  {
    id: 'science',
    nameEn: 'Experimental Sciences (علوم تجريبية)',
    nameAr: 'شعبة العلوم التجريبية',
    defaultSubjects: [
      { id: 'sci_nat', nameEn: 'Natural Sciences', nameAr: 'علوم الطبيعة والحياة', coefficient: 6 },
      { id: 'sci_math', nameEn: 'Mathematics', nameAr: 'الرياضيات', coefficient: 5 },
      { id: 'sci_phys', nameEn: 'Physical Sciences & Chemistry', nameAr: 'العلوم الفيزيائية والتكنولوجيا', coefficient: 5 },
      { id: 'sci_arab', nameEn: 'Arabic Language & Lit', nameAr: 'اللغة العربية وآدابها', coefficient: 3 },
      { id: 'sci_fren', nameEn: 'French Language', nameAr: 'اللغة الفرنسية', coefficient: 2 },
      { id: 'sci_eng', nameEn: 'English Language', nameAr: 'اللغة الإنجليزية', coefficient: 2 },
      { id: 'sci_hist', nameEn: 'History & Geography', nameAr: 'التاريخ والجغرافيا', coefficient: 2 },
      { id: 'sci_isla', nameEn: 'Islamic Education', nameAr: 'العلوم الإسلامية', coefficient: 2 },
      { id: 'sci_phil', nameEn: 'Philosophy', nameAr: 'الفلسفة', coefficient: 2 },
      { id: 'sci_pe', nameEn: 'Physical Education (PE)', nameAr: 'التربية البدنية', coefficient: 1 },
      { id: 'sci_amaz', nameEn: 'Amazigh Language (Optional)', nameAr: 'اللغة الأمازيغية', coefficient: 2 },
    ]
  },
  {
    id: 'math',
    nameEn: 'Mathematics (رياضيات)',
    nameAr: 'شعبة الرياضيات',
    defaultSubjects: [
      { id: 'm_math', nameEn: 'Mathematics', nameAr: 'الرياضيات', coefficient: 7 },
      { id: 'm_phys', nameEn: 'Physical Sciences & Chemistry', nameAr: 'العلوم الفيزيائية والتكنولوجيا', coefficient: 6 },
      { id: 'm_nat', nameEn: 'Natural Sciences', nameAr: 'علوم الطبيعة والحياة', coefficient: 2 },
      { id: 'm_arab', nameEn: 'Arabic Language & Lit', nameAr: 'اللغة العربية وآدابها', coefficient: 3 },
      { id: 'm_fren', nameEn: 'French Language', nameAr: 'اللغة الفرنسية', coefficient: 2 },
      { id: 'm_eng', nameEn: 'English Language', nameAr: 'اللغة الإنجليزية', coefficient: 2 },
      { id: 'm_hist', nameEn: 'History & Geography', nameAr: 'التاريخ والجغرافيا', coefficient: 2 },
      { id: 'm_isla', nameEn: 'Islamic Education', nameAr: 'العلوم الإسلامية', coefficient: 2 },
      { id: 'm_phil', nameEn: 'Philosophy', nameAr: 'الفلسفة', coefficient: 2 },
      { id: 'm_pe', nameEn: 'Physical Education (PE)', nameAr: 'التربية البدنية', coefficient: 1 },
    ]
  },
  {
    id: 'math_tech',
    nameEn: 'Mathematical Tech (تقني رياضي)',
    nameAr: 'شعبة تقني رياضي',
    defaultSubjects: [
      { id: 'mt_tech', nameEn: 'Engineering / Technology', nameAr: 'التكنولوجيا (هندسة)', coefficient: 6 },
      { id: 'mt_math', nameEn: 'Mathematics', nameAr: 'الرياضيات', coefficient: 6 },
      { id: 'mt_phys', nameEn: 'Physical Sciences & Chemistry', nameAr: 'العلوم الفيزيائية والتكنولوجيا', coefficient: 6 },
      { id: 'mt_arab', nameEn: 'Arabic Language & Lit', nameAr: 'اللغة العربية وآدابها', coefficient: 3 },
      { id: 'mt_fren', nameEn: 'French Language', nameAr: 'اللغة الفرنسية', coefficient: 2 },
      { id: 'mt_eng', nameEn: 'English Language', nameAr: 'اللغة الإنجليزية', coefficient: 2 },
      { id: 'mt_hist', nameEn: 'History & Geography', nameAr: 'التاريخ والجغرافيا', coefficient: 2 },
      { id: 'mt_isla', nameEn: 'Islamic Education', nameAr: 'العلوم الإسلامية', coefficient: 2 },
      { id: 'mt_phil', nameEn: 'Philosophy', nameAr: 'الفلسفة', coefficient: 2 },
      { id: 'mt_pe', nameEn: 'Physical Education (PE)', nameAr: 'التربية البدنية', coefficient: 1 },
    ]
  },
  {
    id: 'literary',
    nameEn: 'Literature & Philosophy (آداب وفلسفة)',
    nameAr: 'شعبة آداب وفلسفة',
    defaultSubjects: [
      { id: 'lit_arab', nameEn: 'Arabic Language & Lit', nameAr: 'اللغة العربية وآدابها', coefficient: 6 },
      { id: 'lit_phil', nameEn: 'Philosophy', nameAr: 'الفلسفة', coefficient: 6 },
      { id: 'lit_hist', nameEn: 'History & Geography', nameAr: 'التاريخ والجغرافيا', coefficient: 4 },
      { id: 'lit_fren', nameEn: 'French Language', nameAr: 'اللغة الفرنسية', coefficient: 3 },
      { id: 'lit_eng', nameEn: 'English Language', nameAr: 'اللغة الإنجليزية', coefficient: 3 },
      { id: 'lit_isla', nameEn: 'Islamic Education', nameAr: 'العلوم الإسلامية', coefficient: 2 },
      { id: 'lit_math', nameEn: 'Mathematics', nameAr: 'الرياضيات', coefficient: 2 },
      { id: 'lit_pe', nameEn: 'Physical Education (PE)', nameAr: 'التربية البدنية', coefficient: 1 },
    ]
  },
  {
    id: 'languages',
    nameEn: 'Foreign Languages (لغات أجنبية)',
    nameAr: 'شعبة لغات أجنبية',
    defaultSubjects: [
      { id: 'lang_arab', nameEn: 'Arabic Language & Lit', nameAr: 'اللغة العربية وآدابها', coefficient: 5 },
      { id: 'lang_fren', nameEn: 'French Language', nameAr: 'اللغة الفرنسية', coefficient: 5 },
      { id: 'lang_eng', nameEn: 'English Language', nameAr: 'اللغة الإنجليزية', coefficient: 5 },
      { id: 'lang_third', nameEn: 'German / Spanish / Italian', nameAr: 'اللغة الأجنبية الثالثة (ألمانية/إسبانية/إيطالية)', coefficient: 4 },
      { id: 'lang_phil', nameEn: 'Philosophy', nameAr: 'الفلسفة', coefficient: 3 },
      { id: 'lang_hist', nameEn: 'History & Geography', nameAr: 'التاريخ والجغرافيا', coefficient: 2 },
      { id: 'lang_isla', nameEn: 'Islamic Education', nameAr: 'العلوم الإسلامية', coefficient: 2 },
      { id: 'lang_math', nameEn: 'Mathematics', nameAr: 'الرياضيات', coefficient: 2 },
      { id: 'lang_pe', nameEn: 'Physical Education (PE)', nameAr: 'التربية البدنية', coefficient: 1 },
    ]
  },
  {
    id: 'management',
    nameEn: 'Management & Economics (تسيير وإقتصاد)',
    nameAr: 'شعبة تسيير وإقتصاد',
    defaultSubjects: [
      { id: 'mgt_eco', nameEn: 'Economics & Management', nameAr: 'الاقتصاد والتسيير', coefficient: 5 },
      { id: 'mgt_acc', nameEn: 'Financial Accounting & Math', nameAr: 'التسيير المحاسي والمالي', coefficient: 5 },
      { id: 'mgt_math', nameEn: 'Mathematics', nameAr: 'الرياضيات', coefficient: 4 },
      { id: 'mgt_hist', nameEn: 'History & Geography', nameAr: 'التاريخ والجغرافيا', coefficient: 3 },
      { id: 'mgt_arab', nameEn: 'Arabic Language & Lit', nameAr: 'اللغة العربية وآدابها', coefficient: 3 },
      { id: 'mgt_law', nameEn: 'Law', nameAr: 'القانون', coefficient: 2 },
      { id: 'mgt_fren', nameEn: 'French Language', nameAr: 'اللغة الفرنسية', coefficient: 2 },
      { id: 'mgt_eng', nameEn: 'English Language', nameAr: 'اللغة الإنجليزية', coefficient: 2 },
      { id: 'mgt_isla', nameEn: 'Islamic Education', nameAr: 'العلوم الإسلامية', coefficient: 2 },
      { id: 'mgt_pe', nameEn: 'Physical Education (PE)', nameAr: 'التربية البدنية', coefficient: 1 },
    ]
  }
];

/**
 * Algerian Secondary School Grade Calculation Formula:
 * Subject Average = (((Evaluation + Test) / 2) + (Exam * 2)) / 3
 */
export function calculateSubjectAverage(subject: SubjectGrade): number | null {
  const evalVal = typeof subject.evaluation === 'number' && !isNaN(subject.evaluation) ? subject.evaluation : null;
  const testVal = typeof subject.test === 'number' && !isNaN(subject.test) ? subject.test : null;
  const examVal = typeof subject.exam === 'number' && !isNaN(subject.exam) ? subject.exam : null;

  if (examVal === null) {
    // Cannot calculate without exam in Algerian secondary education
    if (evalVal !== null && testVal !== null) {
      return (evalVal + testVal) / 2;
    }
    if (testVal !== null) return testVal;
    if (evalVal !== null) return evalVal;
    return null;
  }

  let continuousAssessment = 0;
  if (evalVal !== null && testVal !== null) {
    continuousAssessment = (evalVal + testVal) / 2;
  } else if (evalVal !== null) {
    continuousAssessment = evalVal;
  } else if (testVal !== null) {
    continuousAssessment = testVal;
  } else {
    // If no test/eval entered, exam counts directly
    return examVal;
  }

  const avg = (continuousAssessment + (examVal * 2)) / 3;
  return Math.round(avg * 100) / 100;
}

/**
 * Calculates Final Overall GPA based on weighted subjects
 * Final Overall GPA = Sum(Subject Average * Coefficient) / Sum(Coefficients)
 */
export function calculateTrimesterGpa(subjects: SubjectGrade[]): { gpa: number | null; totalPoints: number; totalCoeffs: number } {
  let totalPoints = 0;
  let totalCoeffs = 0;

  for (const sub of subjects) {
    const avg = calculateSubjectAverage(sub);
    if (avg !== null && sub.coefficient > 0) {
      totalPoints += avg * sub.coefficient;
      totalCoeffs += sub.coefficient;
    }
  }

  if (totalCoeffs === 0) return { gpa: null, totalPoints: 0, totalCoeffs: 0 };
  const gpa = Math.round((totalPoints / totalCoeffs) * 100) / 100;
  return { gpa, totalPoints, totalCoeffs };
}

/**
 * Algerian Honor Roll Distinction (تقدير المعدل):
 * >= 16: Excellent (ممتاز)
 * >= 14: Very Good (جيد جداً)
 * >= 12: Good (جيد)
 * >= 10: Satisfactory / Passed (قريب من الجيد / مقبول)
 * < 10: Needs Improvement / Failed (راسب / غير مستوفي)
 */
export function getAlgerianHonorBadge(gpa: number, lang: 'en' | 'ar') {
  if (gpa >= 16) {
    return { title: lang === 'ar' ? 'ممتاز (تهانينا)' : 'Excellent (Congratulations)', color: 'from-emerald-600 to-teal-500', bg: 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40' };
  }
  if (gpa >= 14) {
    return { title: lang === 'ar' ? 'جيد جداً (لوحة شرف)' : 'Very Good (Honor Roll)', color: 'from-teal-600 to-cyan-600', bg: 'bg-teal-900/60 text-teal-200 border-teal-500/40' };
  }
  if (gpa >= 12) {
    return { title: lang === 'ar' ? 'جيد (تشجيع)' : 'Good (Encouragement)', color: 'from-blue-600 to-indigo-600', bg: 'bg-blue-900/60 text-blue-200 border-blue-500/40' };
  }
  if (gpa >= 10) {
    return { title: lang === 'ar' ? 'مقبول (ناجح)' : 'Satisfactory (Passed)', color: 'from-amber-600 to-yellow-600', bg: 'bg-amber-900/60 text-amber-200 border-amber-500/40' };
  }
  return { title: lang === 'ar' ? 'دون المعدل (يتطلب مراجعة)' : 'Below Average (Needs Revision)', color: 'from-rose-600 to-red-600', bg: 'bg-rose-900/60 text-rose-200 border-rose-500/40' };
}
