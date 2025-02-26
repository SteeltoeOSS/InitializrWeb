/*
 * Copyright 2012-2025 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.spring.start.site.extension.dependency.springkafka;

import io.spring.initializr.generator.buildsystem.gradle.GradleBuild;
import io.spring.initializr.generator.spring.build.BuildCustomizer;

/**
 * {@link BuildCustomizer} for Gradle builds to configure the buildpack builder.
 *
 * @author Moritz Halbritter
 */
class SpringKafkaStreamsGradleBuildCustomizer implements BuildCustomizer<GradleBuild> {

	private static final String BUILDER = "paketobuildpacks/builder-jammy-base:latest";

	private final char quote;

	SpringKafkaStreamsGradleBuildCustomizer(char quote) {
		this.quote = quote;
	}

	@Override
	public void customize(GradleBuild build) {
		build.tasks()
			.customize("bootBuildImage",
					(bootBuildImage) -> bootBuildImage.attribute("builder", this.quote + BUILDER + this.quote));
	}

}
